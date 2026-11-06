
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [welcome, setWelcome] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await API.post("/admin/login", {
                email,
                password
            });

            // Store JWT token
            localStorage.setItem("token", response.data.token);

            // Show welcome animation
            setWelcome(true);

            // Navigate after animation
            setTimeout(() => {
                navigate("/");
            }, 1800);

        } catch (error) {
            setError(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F7F6] flex items-center justify-center p-4 sm:p-6 page-animation">

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes successPop {
                    0% { opacity: 0; transform: scale(0.7); }
                    70% { opacity: 1; transform: scale(1.08); }
                    100% { opacity: 1; transform: scale(1); }
                }

                @keyframes checkDraw {
                    from { stroke-dashoffset: 50; }
                    to { stroke-dashoffset: 0; }
                }

                .login-float {
                    animation: float 4s ease-in-out infinite;
                }

                .login-fade {
                    animation: fadeUp 0.7s ease-out both;
                }

                .success-pop {
                    animation: successPop 0.5s ease-out both;
                }

                .check-draw {
                    stroke-dasharray: 50;
                    stroke-dashoffset: 50;
                    animation: checkDraw 0.5s 0.3s ease forwards;
                }

                @media (prefers-reduced-motion: reduce) {
                    .login-float, .login-fade, .success-pop, .check-draw {
                        animation: none !important;
                    }
                }
            `}</style>

            <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl shadow-2xl shadow-[#0B1F2A]/10 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT SIDE - BRANDING AND ILLUSTRATION */}
                <div className="relative overflow-hidden bg-[#0B1F2A] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 min-h-[280px] lg:min-h-full">

                    {/* Background decorations */}
                    <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-[#0F766E]/30 blur-3xl" />
                    <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-[#2DD4BF]/10 blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-[#0F766E] flex items-center justify-center shadow-lg shadow-teal-900/40">
                                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                    <path d="M3 6.5L12 13L21 6.5M5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7C3 5.9 3.9 5 5 5Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>

                            <span className="text-2xl font-bold tracking-tight">
                                Bulk<span className="text-[#2DD4BF]">Mail</span>
                            </span>
                        </div>

                        <div className="mt-10 lg:mt-16">
                            <p className="text-[#2DD4BF] uppercase tracking-[0.25em] text-xs font-bold mb-4">
                                Smart Email Management
                            </p>

                            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight max-w-lg">
                                Every message.
                                <span className="block text-[#2DD4BF]">
                                    One powerful platform.
                                </span>
                            </h1>

                            <p className="mt-5 text-slate-300 leading-relaxed max-w-md text-sm sm:text-base">
                                Manage your campaigns, reach your audience,
                                and keep track of every email — all in one place.
                            </p>
                        </div>
                    </div>

                    {/* Custom email illustration */}
                    <div className="relative z-10 hidden sm:flex justify-center items-center py-8 lg:py-12">
                        <div className="login-float relative w-full max-w-sm">

                            <div className="absolute top-0 right-4 w-16 h-16 rounded-2xl bg-[#0F766E]/40 rotate-12" />
                            <div className="absolute bottom-0 left-2 w-12 h-12 rounded-full bg-[#2DD4BF]/20" />

                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">

                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-xs text-slate-300">Campaign overview</p>
                                        <p className="text-lg font-bold mt-1">Email activity</p>
                                    </div>
                                    <div className="w-10 h-10 bg-[#0F766E] rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                            <path d="M4 12L20 4L13 20L10 13L4 12Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 text-[#0B1F2A]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold">Campaign sent</span>
                                        <span className="text-xs text-[#0F766E] font-bold">Successful</span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-5">
                                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                                <path d="M3 6.5L12 13L21 6.5M5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7C3 5.9 3.9 5 5 5Z" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>

                                        <div>
                                            <p className="text-2xl font-bold">Ready</p>
                                            <p className="text-xs text-slate-500">Your email workspace</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full w-4/5 bg-[#0F766E] rounded-full" />
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2 mt-5">
                                    <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                                    <span className="w-2 h-2 rounded-full bg-white/30" />
                                    <span className="w-2 h-2 rounded-full bg-white/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-slate-400 mt-8">
                        © 2026 BulkMail. All rights reserved.
                    </p>
                </div>

                {/* RIGHT SIDE - LOGIN FORM */}
                <div className="flex items-center justify-center p-7 sm:p-12 lg:p-16">

                    <div className="w-full max-w-md login-fade">

                        <div className="mb-9">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mb-6">
                                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                    <path d="M12 12C14.2 12 16 10.2 16 8S14.2 4 12 4S8 5.8 8 8S9.8 12 12 12Z" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="M4 20C4 16.7 7.6 14 12 14S20 16.7 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                            </div>

                            <p className="text-sm font-semibold text-[#0F766E] mb-2">
                                ADMIN PORTAL
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F2A] tracking-tight">
                                Welcome back!
                            </h2>

                            <p className="text-slate-500 mt-3 text-sm sm:text-base">
                                Please sign in to access your email dashboard.
                            </p>
                        </div>

                        {error && (
                            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                                <span className="font-bold">!</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6.5L12 13L21 6.5M5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7C3 5.9 3.9 5 5 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        autoComplete="username"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-[#0B1F2A] outline-none transition-all focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-teal-700/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none">
                                        <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                                        <path d="M8 10V7C8 4.8 9.8 3 12 3S16 4.8 16 7V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                    </svg>

                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-[#0B1F2A] outline-none transition-all focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-teal-700/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || welcome}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-4 text-sm font-bold text-white shadow-lg shadow-teal-800/20 transition-all duration-300 hover:bg-[#0B5F59] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                                            <path d="M21 12A9 9 0 0012 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs text-slate-400">SECURE ADMIN ACCESS</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6">
                            Protected access for authorized administrators only.
                        </p>
                    </div>
                </div>
            </div>

            {/* SUCCESS / WELCOME ANIMATION */}
            {welcome && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F2A]/90 backdrop-blur-md p-4">
                    <div className="success-pop text-center text-white max-w-sm w-full">

                        <div className="w-24 h-24 rounded-full bg-[#0F766E] mx-auto flex items-center justify-center shadow-2xl shadow-teal-500/30">
                            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                                <path
                                    d="M5 12L10 17L20 7"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="check-draw"
                                />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold mt-8">
                            Welcome Back!
                        </h2>

                        <p className="text-[#2DD4BF] font-semibold mt-3">
                            Login successful 🎉
                        </p>

                        <p className="text-slate-300 text-sm mt-3">
                            Your workspace is ready. Taking you to your dashboard...
                        </p>

                        <div className="mt-8 w-40 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
                            <div className="h-full bg-[#2DD4BF] rounded-full animate-[loading_1.8s_linear_forwards]" />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Login;
