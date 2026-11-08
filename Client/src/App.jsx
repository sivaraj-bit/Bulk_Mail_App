
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import SendEmail from "./pages/SendEmail";
import EmailHistory from "./pages/EmailHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAdmin from "./pages/CreateAdmin";

function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />

            <main className="flex-1">
                <Navbar />

                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/send-email" element={<SendEmail />} />
                        <Route path="/email-history" element={<EmailHistory />} />
                        <Route path="/create-admin" element={<CreateAdmin />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/*" element={<AdminLayout />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
