
import { useEffect, useState } from "react";
import API from "../services/api";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

function Dashboard() {
    const [stats, setStats] = useState({
        totalEmails: 0,
        totalRecipients: 0,
        successfulEmails: 0,
        partialEmails: 0,
        failedEmails: 0
    });

    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError("");

            const [statsResponse, analyticsResponse] = await Promise.all([
                API.get("/emails/stats"),
                API.get("/emails/analytics/daily")
            ]);

            setStats({
                ...statsResponse.data,
                partialEmails: statsResponse.data.partialEmails || 0
            });

            setAnalytics(analyticsResponse.data.analytics || []);

        } catch (error) {
            console.error("Dashboard error:", error);
            setError("Failed to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const processedEmails =
        stats.successfulEmails +
        stats.partialEmails +
        stats.failedEmails;

    const successRate = processedEmails
        ? Math.round((stats.successfulEmails / processedEmails) * 100)
        : 0;

    const partialRate = processedEmails
        ? Math.round((stats.partialEmails / processedEmails) * 100)
        : 0;

    const failureRate = processedEmails
        ? Math.round((stats.failedEmails / processedEmails) * 100)
        : 0;

    const averageRecipients = stats.totalEmails
        ? (stats.totalRecipients / stats.totalEmails).toFixed(1)
        : 0;

    const cards = [
        {
            title: "Total Emails",
            value: stats.totalEmails,
            icon: "✉",
            description: "All recorded campaigns",
            color: "bg-teal-50 text-[#0F766E]",
            accent: "border-l-[#0F766E]"
        },
        {
            title: "Total Recipients",
            value: stats.totalRecipients,
            icon: "♧",
            description: "Total recipients",
            color: "bg-cyan-50 text-cyan-700",
            accent: "border-l-cyan-500"
        },
        {
            title: "Successful Emails",
            value: stats.successfulEmails,
            icon: "✓",
            description: `${successRate}% success rate`,
            color: "bg-emerald-50 text-emerald-700",
            accent: "border-l-emerald-500"
        },
        {
            title: "Partial Emails",
            value: stats.partialEmails,
            icon: "◐",
            description: `${partialRate}% partially accepted`,
            color: "bg-amber-50 text-amber-700",
            accent: "border-l-amber-500"
        },
        {
            title: "Failed Emails",
            value: stats.failedEmails,
            icon: "!",
            description: `${failureRate}% failure rate`,
            color: "bg-rose-50 text-rose-600",
            accent: "border-l-rose-500"
        }
    ];

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-[#0F766E]" />
                <p className="text-sm font-medium text-slate-500">
                    Loading dashboard analytics...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-animation rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                <p className="mb-4 text-rose-600">{error}</p>
                <button
                    onClick={fetchStats}
                    className="button-animation rounded-xl bg-[#0F766E] px-5 py-3 font-semibold text-white hover:bg-[#0B5F59]"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="page-animation min-h-screen space-y-7 bg-[#F4F8F8] p-2 sm:p-5">

            {/* Welcome Header */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-[#0F766E]">
                        EMAIL ANALYTICS
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1F2A] sm:text-3xl">
                        Welcome back, {admin.name || "Admin"}!
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Here's an overview of your email campaigns.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    className="button-animation flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/10 hover:bg-[#0B5F59] hover:shadow-lg active:scale-95"
                >
                    <span className="text-lg">↻</span>
                    Refresh Data
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {cards.map((card, index) => (
                    <div
                        key={card.title}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={`card-animation animate-[fadeIn_0.5s_ease-out_both] rounded-2xl border border-slate-100 border-l-4 ${card.accent} bg-white p-5 shadow-sm sm:p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                {card.title}
                            </p>

                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#0B1F2A]">
                            {card.value.toLocaleString()}
                        </h2>

                        <p className="mt-2 text-xs text-slate-400">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Analytics Chart */}
            <div className="card-animation overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#0B1F2A]">
                        Daily Email Analytics
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Successful, partial and failed campaigns over the last 7 days
                    </p>
                </div>

                {analytics.length > 0 ? (
                    <div className="h-[280px] w-full sm:h-[330px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={analytics}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 5
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#E2E8F0"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) =>
                                        new Date(`${date}T00:00:00`).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short"
                                            }
                                        )
                                    }
                                    tick={{ fill: "#64748B", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: "#64748B", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={35}
                                />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #E2E8F0",
                                        boxShadow: "0 8px 25px rgba(11,31,42,0.08)"
                                    }}
                                />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="sent"
                                    name="Successful"
                                    stroke="#0F766E"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#0F766E" }}
                                    activeDot={{ r: 7 }}
                                    animationDuration={1200}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="partial"
                                    name="Partial"
                                    stroke="#D97706"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#D97706" }}
                                    activeDot={{ r: 7 }}
                                    animationDuration={1200}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="failed"
                                    name="Failed"
                                    stroke="#F43F5E"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#F43F5E" }}
                                    activeDot={{ r: 7 }}
                                    animationDuration={1200}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex h-[280px] items-center justify-center">
                        <p className="text-center text-sm text-slate-400">
                            No email analytics available for the last 7 days.
                        </p>
                    </div>
                )}
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                {/* Email Performance */}
                <div className="card-animation rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-[#0B1F2A]">
                                Email Performance
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Successful, partial and failed email summary
                            </p>
                        </div>

                        <span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold text-[#0F766E]">
                            All time
                        </span>
                    </div>

                    {/* Success Rate */}
                    <div className="mt-8">
                        <div className="flex justify-between gap-3">
                            <span className="text-sm font-medium text-slate-600">
                                Successful Emails
                            </span>
                            <span className="font-bold text-[#0F766E]">
                                {successRate}%
                            </span>
                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#0F766E] transition-all duration-1000 ease-out"
                                style={{ width: `${successRate}%` }}
                            />
                        </div>
                    </div>

                    {/* Partial Rate */}
                    <div className="mt-7">
                        <div className="flex justify-between gap-3">
                            <span className="text-sm font-medium text-slate-600">
                                Partially Accepted Emails
                            </span>
                            <span className="font-bold text-amber-600">
                                {partialRate}%
                            </span>
                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-1000 ease-out"
                                style={{ width: `${partialRate}%` }}
                            />
                        </div>
                    </div>

                    {/* Failure Rate */}
                    <div className="mt-7">
                        <div className="flex justify-between gap-3">
                            <span className="text-sm font-medium text-slate-600">
                                Failed Emails
                            </span>
                            <span className="font-bold text-rose-500">
                                {failureRate}%
                            </span>
                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-rose-500 transition-all duration-1000 ease-out"
                                style={{ width: `${failureRate}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-5 border-t border-slate-100 pt-5">
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="h-3 w-3 rounded-full bg-[#0F766E]" />
                            Successful: {stats.successfulEmails}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="h-3 w-3 rounded-full bg-amber-500" />
                            Partial: {stats.partialEmails}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="h-3 w-3 rounded-full bg-rose-500" />
                            Failed: {stats.failedEmails}
                        </p>
                    </div>
                </div>

                {/* Quick Insights */}
                <div className="card-animation rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-lg font-bold text-[#0B1F2A]">
                        Quick Insights
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Your email overview
                    </p>

                    <div className="mt-7 space-y-6">
                        <div>
                            <p className="text-sm text-slate-500">
                                Success Rate
                            </p>
                            <h3 className="mt-1 text-3xl font-bold text-[#0F766E]">
                                {successRate}%
                            </h3>
                        </div>

                        <div className="border-t border-slate-100 pt-5">
                            <p className="text-sm text-slate-500">
                                Partial Rate
                            </p>
                            <h3 className="mt-1 text-3xl font-bold text-amber-600">
                                {partialRate}%
                            </h3>
                        </div>

                        <div className="border-t border-slate-100 pt-5">
                            <p className="text-sm text-slate-500">
                                Failure Rate
                            </p>
                            <h3 className="mt-1 text-3xl font-bold text-rose-500">
                                {failureRate}%
                            </h3>
                        </div>

                        <div className="border-t border-slate-100 pt-5">
                            <p className="text-sm text-slate-500">
                                Average Recipients per Email
                            </p>
                            <h3 className="mt-1 text-3xl font-bold text-[#0B1F2A]">
                                {averageRecipients}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Overview */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-[#0B1F2A]">
                    Campaign Overview
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Overall email activity recorded in your database
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="card-animation rounded-xl bg-teal-50 p-5">
                        <p className="text-sm font-medium text-[#0F766E]">
                            Total Campaigns
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-[#0B1F2A]">
                            {stats.totalEmails}
                        </h3>
                    </div>

                    <div className="card-animation rounded-xl bg-cyan-50 p-5">
                        <p className="text-sm font-medium text-cyan-700">
                            Total Recipients
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-[#0B1F2A]">
                            {stats.totalRecipients}
                        </h3>
                    </div>

                    <div className="card-animation rounded-xl bg-emerald-50 p-5">
                        <p className="text-sm font-medium text-emerald-700">
                            Successful Emails
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-[#0B1F2A]">
                            {stats.successfulEmails}
                        </h3>
                    </div>

                    <div className="card-animation rounded-xl bg-amber-50 p-5">
                        <p className="text-sm font-medium text-amber-700">
                            Partial Emails
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-[#0B1F2A]">
                            {stats.partialEmails}
                        </h3>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
