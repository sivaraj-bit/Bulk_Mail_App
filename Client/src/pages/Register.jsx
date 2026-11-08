import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/user/register", {
                name,
                email,
                password
            });

            setSuccess(response.data.message || "Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Bulk<span className="text-teal-400">Mail</span>
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Create your normal user account
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Create Account
                    </h2>

                    <p className="text-slate-400 text-sm mb-6">
                        Register to start sending bulk emails.
                    </p>

                    <form onSubmit={handleRegister} className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-400"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-16 text-white outline-none focus:border-teal-400"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400 text-sm"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-16 text-white outline-none focus:border-teal-400"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400 text-sm"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        {/* Success */}
                        {success && (
                            <p className="text-green-400 text-sm">
                                {success}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-semibold py-3 rounded-lg transition"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-teal-400 hover:text-teal-300 font-medium"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Register;