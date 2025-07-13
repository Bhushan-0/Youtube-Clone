import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [payload, setPayload] = useState({ userName: "", email: "", password: "" });
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    const [isLoading, setIsLoading] = useState(false);

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, payload, config);
            setIsLoading(false);
            navigate("/login");
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex px-4 items-center justify-center h-screen">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl text-dark font-bold text-center mb-4">Register</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="userName"
                        placeholder="Name"
                        value={payload.userName}
                        onChange={handleChange}
                        className="p-2 rounded text-dark border border-gray-300"
                        required
                    />

                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={payload.email}
                        onChange={handleChange}
                        className="p-2 rounded text-dark border border-gray-300"
                        required
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={payload.password}
                        onChange={handleChange}
                        className="p-2 rounded text-dark border border-gray-300"
                        required
                    />

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-500 cursor-pointer text-white py-2 rounded font-semibold hover:bg-blue-600"
                    >
                        {
                            isLoading ? "Loading..." : "Register"
                        }
                    </button>
                </form>
                <div className="text-center mt-4">Already have an account? <Link className="text-blue-700 font-semibold" to={"/login"}>Login here</Link></div>
            </div>
        </div>
    );
};

export default Register;