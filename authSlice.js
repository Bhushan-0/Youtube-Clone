import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { decodeToken } from "../../../utils/decodeJwt.js";

// Slice for loginUser
export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async (credentials, { rejectWithValue }) => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, credentials, config);
            const { token } = response.data;

            if (!token) return rejectWithValue("Invalid token received from server");

            // Decode token
            const decodedToken = decodeToken(token);

            if (decodedToken) {
                localStorage.setItem("token", token);

                return {
                    token,
                    decodedToken
                }
            }

            return rejectWithValue("Invalid token");
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || "Login failed")
        }
    }
)

// Slice for fetch user profile
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token provided");
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            return response?.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || "Failed to fetch user profile")
        }
    }
)

const authSlice = createSlice({
    name: "auth",

    // Redux initial state for auth
    initialState: {
        user: {
            token: null,
            data: null,
            isAuthenticated: false,
        },
        loading: false,
        error: null
    },

    // Logout reducer - clear redux state after logout
    reducers: {
        logout: (state) => {
            state.user.isAuthenticated = false;
            state.user.token = null;
            state.user.data = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("token");
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // login fulfilled store the user token and data in redux state
            .addCase(loginUser.fulfilled, (state, action) => {
                const { token, decodedToken } = action.payload;
                if (token) localStorage.setItem("token", token);
                state.user.token = token;
                state.user.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.user.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user.data = action.payload.user;
                state.loading = false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;