import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import videoReducer from "./slices/videoSlice"
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";

// config persist root to persist to persist our store after reload
const persistConfig = {
    key: "youtube-root",
    storage
}

const rootReducer = combineReducers({
    auth: authReducer,
    videos: videoReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store);
export default store;