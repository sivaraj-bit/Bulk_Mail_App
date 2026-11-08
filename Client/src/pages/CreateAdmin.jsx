
import { useState } from "react";
import API from "../services/api";

function CreateAdmin() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle admin creation
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Validate required fields
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("All fields are required");
            return;
        }

        // Validate password
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/admin/register", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            setMessage(response.data.message);

            // Reset form
            setFormData({
                name: "",
                email: "",
                password: ""
            });

            setShowPassword(false);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create admin. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Create Admin
                </h1>

                <p className="mt-2 text-slate-500">
                    Add a new administrator to your BulkMail system.
                </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                {/* Success Message */}
                {message && (
                    <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter admin name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-teal-700 hover:text-teal-900"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-slate-400">
                            Password must contain at least 8 characters.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#0F766E] px-5 py-3.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating Admin..." : "Create Admin"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateAdmin;
