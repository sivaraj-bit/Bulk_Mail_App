
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function EmailHistory() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedEmail, setSelectedEmail] = useState(null);

    // Fetch Email History
    const fetchEmails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/emails/history");
            setEmails(response.data.emails || []);
        } catch (error) {
            console.error("Email history error:", error);
            setError("Failed to load email history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    // Filter and Search
    const filteredEmails = useMemo(() => {
        return emails.filter((email) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                email.subject?.toLowerCase().includes(searchValue) ||
                email.recipients?.some((recipient) =>
                    recipient.toLowerCase().includes(searchValue)
                );

            const matchesFilter =
                filter === "all" || email.status === filter;

            return matchesSearch && matchesFilter;
        });
    }, [emails, search, filter]);

    // Summary
    const totalEmails = emails.length;

    const successfulEmails = emails.filter(
        (email) => email.status === "sent"
    ).length;

    const partialEmails = emails.filter(
        (email) => email.status === "partial"
    ).length;

    const failedEmails = emails.filter(
        (email) => email.status === "failed"
    ).length;

    // Format Date
    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Status Badge
    const StatusBadge = ({ status }) => {
        const styles = {
            sent: "bg-teal-50 text-[#0F766E] ring-teal-200",
            partial: "bg-amber-50 text-amber-700 ring-amber-200",
            failed: "bg-rose-50 text-rose-600 ring-rose-200",
            pending: "bg-slate-100 text-slate-600 ring-slate-200"
        };

        const labels = {
            sent: "Successful",
            partial: "Partial",
            failed: "Failed",
            pending: "Pending"
        };

        return (
            <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                    styles[status] ||
                    "bg-slate-100 text-slate-600 ring-slate-200"
                }`}
            >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {labels[status] || "Unknown"}
            </span>
        );
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-80 flex-col items-center justify-center gap-4 bg-[#F4F8F8]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-[#0F766E]" />
                <p className="animate-pulse text-sm font-medium text-slate-500">
                    Loading email history...
                </p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex min-h-80 items-center justify-center bg-[#F4F8F8] p-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
                        !
                    </div>

                    <h2 className="mt-4 font-bold text-[#0B1F2A]">
                        Something went wrong
                    </h2>

                    <p className="mb-5 mt-2 text-sm text-rose-500">
                        {error}
                    </p>

                    <button
                        onClick={fetchEmails}
                        className="button-animation rounded-xl bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#115E59]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-6 bg-[#F4F8F8] p-2 sm:p-4 lg:p-6">

            {/* Page Header */}
            <div className="page-animation flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-[#0F766E]">
                        EMAIL MANAGEMENT
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1F2A] sm:text-3xl">
                        Email History
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        View and manage all your previous email campaigns.
                    </p>
                </div>

                <button
                    onClick={fetchEmails}
                    className="button-animation flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#115E59]"
                >
                    <span className="text-lg">↻</span>
                    Refresh History
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* Total Campaigns */}
                <div className="card-animation rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Total Campaigns
                        </p>

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl text-[#0F766E]">
                            ✉
                        </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-[#0B1F2A]">
                        {totalEmails}
                    </h2>

                    <p className="mt-2 text-xs text-slate-400">
                        All recorded campaigns
                    </p>
                </div>

                {/* Successful */}
                <div className="card-animation rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Successful
                        </p>

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl text-[#0F766E]">
                            ✓
                        </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-[#0F766E]">
                        {successfulEmails}
                    </h2>

                    <p className="mt-2 text-xs text-slate-400">
                        Successfully processed campaigns
                    </p>
                </div>

                {/* Partial */}
                <div className="card-animation rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Partial Emails
                        </p>

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
                            !
                        </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-amber-600">
                        {partialEmails}
                    </h2>

                    <p className="mt-2 text-xs text-slate-400">
                        Emails partially accepted
                    </p>
                </div>

                {/* Failed */}
                <div className="card-animation rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Failed
                        </p>

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-xl text-rose-500">
                            !
                        </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-rose-500">
                        {failedEmails}
                    </h2>

                    <p className="mt-2 text-xs text-slate-400">
                        Campaigns that failed
                    </p>
                </div>
            </div>

            {/* Email History Table */}
            <div className="card-animation overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">

                {/* Table Header */}
                <div className="border-b border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-[#0B1F2A]">
                                All Email Campaigns
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Search and filter your email activity.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            {/* Search */}
                            <div className="relative min-w-0 flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search subject or recipient..."
                                    className="w-full rounded-xl border border-slate-200 bg-[#F4F8F8] py-3 pl-10 pr-4 text-sm text-[#0B1F2A] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-teal-500/10 sm:w-64"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-[#F4F8F8] px-4 py-3 text-sm text-slate-600 outline-none transition-all duration-300 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/10"
                            >
                                <option value="all">All Status</option>
                                <option value="sent">Successful</option>
                                <option value="partial">Partial</option>
                                <option value="failed">Failed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F4F8F8]/80 px-4 py-3 sm:px-6">
                    <p className="text-xs font-medium text-slate-500">
                        Showing{" "}
                        <span className="font-bold text-[#0F766E]">
                            {filteredEmails.length}
                        </span>{" "}
                        of {totalEmails} campaigns
                    </p>

                    {(search || filter !== "all") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setFilter("all");
                            }}
                            className="text-xs font-semibold text-[#0F766E] transition hover:text-[#0B1F2A]"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Responsive Table */}
                {filteredEmails.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
                            <thead className="bg-[#F4F8F8] text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Subject
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Recipients
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-right font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredEmails.map((email) => (
                                    <tr
                                        key={email._id}
                                        className="transition-colors duration-200 hover:bg-teal-50/50"
                                    >
                                        <td className="px-6 py-5">
                                            <p className="max-w-[220px] truncate text-sm font-semibold text-[#0B1F2A]">
                                                {email.subject}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                ID: {email._id?.slice(-8)}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-slate-700">
                                                {email.recipients?.length || 0} recipients
                                            </p>

                                            <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                                                {email.recipients?.slice(0, 2).join(", ") || "No recipients"}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <StatusBadge status={email.status} />
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="whitespace-nowrap text-sm text-slate-600">
                                                {formatDate(email.sentAt || email.createdAt)}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => setSelectedEmail(email)}
                                                className="button-animation whitespace-nowrap rounded-lg bg-teal-50 px-4 py-2 text-xs font-semibold text-[#0F766E] hover:bg-teal-100"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="px-5 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
                            ✉
                        </div>

                        <h3 className="mt-4 font-semibold text-[#0B1F2A]">
                            No campaigns found
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            {search || filter !== "all"
                                ? "Try changing your search or filter."
                                : "Your email history will appear here."}
                        </p>

                        {(search || filter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setFilter("all");
                                }}
                                className="mt-4 text-sm font-semibold text-[#0F766E] transition hover:text-[#0B1F2A]"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Email Details Modal */}
            {selectedEmail && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F2A]/60 p-3 backdrop-blur-sm sm:p-5"
                    onClick={() => setSelectedEmail(null)}
                >
                    <div
                        className="modal-animation max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/20 bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4 sm:p-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#0B1F2A] sm:text-xl">
                                    Email Details
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Campaign information
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
                                aria-label="Close details"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-5 p-4 sm:p-6">

                            {/* Subject */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Subject
                                </p>

                                <p className="mt-2 break-words font-semibold text-[#0B1F2A]">
                                    {selectedEmail.subject}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Status
                                </p>

                                <div className="mt-2">
                                    <StatusBadge status={selectedEmail.status} />
                                </div>
                            </div>

                            {/* Recipients */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Recipients ({selectedEmail.recipients?.length || 0})
                                </p>

                                <div className="mt-2 max-h-36 space-y-2 overflow-y-auto rounded-xl border border-slate-100 bg-[#F4F8F8] p-4">
                                    {selectedEmail.recipients?.map((recipient, index) => (
                                        <p
                                            key={`${recipient}-${index}`}
                                            className="break-all text-sm text-slate-600"
                                        >
                                            {recipient}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Email Message
                                </p>

                                <div className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-[#F4F8F8] p-4 text-sm leading-7 text-slate-600">
                                    {selectedEmail.body}
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Sent Date
                                </p>

                                <p className="mt-2 text-sm text-slate-600">
                                    {formatDate(selectedEmail.sentAt || selectedEmail.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-100 p-4 text-right sm:p-5">
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="button-animation rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmailHistory;
