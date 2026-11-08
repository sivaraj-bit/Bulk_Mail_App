
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const role = localStorage.getItem("role");

    const links = [
        { name: "Dashboard", path: "/", icon: "▦" },
        { name: "Send Email", path: "/send-email", icon: "✉" },
        { name: "Email History", path: "/email-history", icon: "◷" },
        ...(role === "Admin"
            ? [{ name: "Create Admin", path: "/create-admin", icon: "＋" }]
            : [])
    ];

    const navigation = (
        <nav className="space-y-2">
            {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/"}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ease-out hover:translate-x-1 ${
                            isActive
                                ? "bg-[#0F766E] text-white shadow-lg shadow-teal-950/30"
                                : "text-slate-400 hover:bg-[#173743] hover:text-white"
                        }`
                    }
                >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.name}</span>
                </NavLink>
            ))}
        </nav>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-xl bg-[#0B1F2A] p-3 text-white shadow-lg transition-all duration-200 hover:bg-[#0F766E] active:scale-95 md:hidden"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
            >
                ☰
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-[#0B1F2A] p-6 text-white md:flex">
                <div className="mb-12">
                    <h1 className="text-2xl font-bold tracking-wide">
                        Bulk<span className="text-[#2DD4BF]">Mail</span>
                    </h1>
                    <p className="mt-2 text-xs text-slate-400">
                        Email Management System
                    </p>
                </div>

                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Main Menu
                </p>

                {navigation}

                <div className="mt-auto border-t border-slate-700 pt-6">
                    <p className="text-xs text-slate-400">
                        BulkMail Dashboard
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Manage your campaigns
                    </p>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-50 md:hidden ${
                    isOpen
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                }`}
                aria-hidden={!isOpen}
            >
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 h-full w-full bg-black/60 transition-opacity duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    aria-label="Close navigation menu"
                    tabIndex={isOpen ? 0 : -1}
                />

                <aside
                    className={`relative flex h-full w-72 max-w-[85%] flex-col bg-[#0B1F2A] p-6 text-white shadow-2xl transition-transform duration-300 ease-in-out ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="mb-12 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Bulk<span className="text-[#2DD4BF]">Mail</span>
                            </h1>
                            <p className="mt-2 text-xs text-slate-400">
                                Email Management System
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg px-3 py-2 text-xl text-slate-400 transition-colors hover:bg-[#173743] hover:text-white"
                            aria-label="Close navigation menu"
                        >
                            ×
                        </button>
                    </div>

                    <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Main Menu
                    </p>

                    {navigation}

                    <div className="mt-auto border-t border-slate-700 pt-6">
                        <p className="text-xs text-slate-400">
                            BulkMail Dashboard
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Manage your campaigns
                        </p>
                    </div>
                </aside>
            </div>
        </>
    );
}

export default Sidebar;
