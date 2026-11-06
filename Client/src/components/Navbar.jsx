
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    const pageTitles = {
        "/": "Dashboard",
        "/send-email": "Send Email",
        "/email-history": "Email History",
    };

    const currentTitle = pageTitles[location.pathname] || "Dashboard";
    const initial = admin.name?.charAt(0).toUpperCase() || "A";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        navigate("/login", { replace: true });
    };

    return (
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md transition-all duration-300 sm:px-6 md:px-8">

            {/* Page Title */}
            <div className="pl-12 md:pl-0">
                <h2 className="text-lg font-bold text-[#0B1F2A] transition-colors duration-200 sm:text-xl">
                    {currentTitle}
                </h2>

                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                    Welcome back! Manage your email campaigns.
                </p>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 sm:gap-5">

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-[#0F766E] ring-2 ring-teal-50 transition-transform duration-300 hover:scale-110">
                        {initial}
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-[#0B1F2A]">
                            {admin.name || "Admin"}
                        </p>

                        <p className="max-w-36 truncate text-xs text-slate-500">
                            {admin.email || "Administrator"}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl bg-[#0B1F2A] px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0F766E] hover:shadow-lg hover:shadow-teal-900/20 active:scale-95 sm:px-4"
                >
                    <span>↪</span>
                    <span>Logout</span>
                </button>

            </div>
        </header>
    );
}

export default Navbar;
