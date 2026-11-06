
import { useState } from "react";
import API from "../services/api";

function SendEmail() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [recipients, setRecipients] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const recipientList = recipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !body.trim() || recipientList.length === 0) {
            setMessage("Please fill in all fields.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setMessageType("");

            const response = await API.post("/emails/send", {
                subject,
                body,
                recipients: recipientList
            });

            setMessage(response.data.message || "Emails sent successfully!");
            setMessageType("success");

            setSubject("");
            setBody("");
            setRecipients("");

        } catch (error) {
            console.error("API ERROR:", error);

            setMessage(
                error.response?.data?.message ||
                error.message ||
                "Failed to send emails."
            );

            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSubject("");
        setBody("");
        setRecipients("");
        setMessage("");
        setMessageType("");
    };

    const inputClasses =
        "w-full rounded-xl border border-slate-200 bg-[#F4F8F8] px-4 py-3 text-sm text-[#0B1F2A] outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-teal-300 focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-teal-500/10";

    return (
        <div className="min-h-screen space-y-6 bg-[#F4F8F8] p-2 sm:p-4 lg:p-6">

            {/* Page Header */}
            <div className="page-animation">
                <p className="text-xs font-bold tracking-[0.18em] text-[#0F766E]">
                    EMAIL MANAGEMENT
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1F2A] sm:text-3xl">
                    Send Bulk Email
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create and send email campaigns to multiple recipients.
                </p>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

                {/* Email Form */}
                <div className="min-w-0 xl:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="card-animation overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
                    >

                        {/* Form Header */}
                        <div className="border-b border-slate-100 bg-gradient-to-r from-[#0B1F2A] to-[#134E4A] p-5 sm:p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl text-[#2DD4BF]">
                                    ✉
                                </div>

                                <div>
                                    <h2 className="font-bold text-white">
                                        Compose Email
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-300">
                                        Prepare your email campaign
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-4 sm:p-6">

                            {/* Recipients */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1F2A]">
                                    Recipients
                                    <span className="ml-1 text-rose-500">*</span>
                                </label>

                                <textarea
                                    value={recipients}
                                    onChange={(e) => setRecipients(e.target.value)}
                                    placeholder="example@gmail.com, user@gmail.com"
                                    rows={4}
                                    required
                                    className={`${inputClasses} resize-y`}
                                />

                                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs text-slate-400">
                                        Separate multiple email addresses using commas.
                                    </p>

                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E]">
                                        {recipientList.length} recipients
                                    </span>
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1F2A]">
                                    Email Subject
                                    <span className="ml-1 text-rose-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter your email subject"
                                    required
                                    className={inputClasses}
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1F2A]">
                                    Email Message
                                    <span className="ml-1 text-rose-500">*</span>
                                </label>

                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Write your email message here..."
                                    rows={9}
                                    required
                                    className={`${inputClasses} resize-y leading-7`}
                                />

                                <p className="mt-2 text-right text-xs text-slate-400">
                                    {body.length} characters
                                </p>
                            </div>

                            {/* Notification */}
                            {message && (
                                <div
                                    role="alert"
                                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm animate-[fadeIn_0.3s_ease-out] ${
                                        messageType === "success"
                                            ? "border-teal-100 bg-teal-50 text-[#0F766E]"
                                            : "border-rose-100 bg-rose-50 text-rose-600"
                                    }`}
                                >
                                    <span className="font-bold">
                                        {messageType === "success" ? "✓" : "!"}
                                    </span>

                                    <p className="break-words">{message}</p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                <button
                                    type="button"
                                    onClick={handleClear}
                                    disabled={loading}
                                    className="button-animation rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Clear Form
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="button-animation flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/10 hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <span>✉</span>
                                            Send Campaign
                                        </>
                                    )}
                                </button>

                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Information Panel */}
                <div className="min-w-0 space-y-5">

                    {/* Campaign Summary */}
                    <div className="card-animation rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-xl">
                                📊
                            </div>

                            <div>
                                <h2 className="font-bold text-[#0B1F2A]">
                                    Campaign Summary
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Your current email details
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-slate-500">
                                    Recipients
                                </span>

                                <span className="rounded-lg bg-teal-50 px-3 py-1 font-bold text-[#0F766E]">
                                    {recipientList.length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-slate-500">
                                    Subject
                                </span>

                                <span className="max-w-[55%] truncate text-right text-sm font-medium text-[#0B1F2A]">
                                    {subject || "Not added"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-slate-500">
                                    Message
                                </span>

                                <span className="text-sm font-medium text-[#0B1F2A]">
                                    {body.length} characters
                                </span>
                            </div>

                        </div>

                        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#0F766E] transition-all duration-500"
                                style={{
                                    width: `${Math.min(recipientList.length * 2, 100)}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Helpful Tips */}
                    <div className="card-animation rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 sm:p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                            💡
                        </div>

                        <h2 className="mt-4 font-bold text-[#0B1F2A]">
                            Helpful Tips
                        </h2>

                        <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                            <li className="flex gap-2">
                                <span className="font-bold text-[#0F766E]">✓</span>
                                Double-check recipient email addresses.
                            </li>

                            <li className="flex gap-2">
                                <span className="font-bold text-[#0F766E]">✓</span>
                                Use a clear and meaningful subject.
                            </li>

                            <li className="flex gap-2">
                                <span className="font-bold text-[#0F766E]">✓</span>
                                Keep your email message simple and readable.
                            </li>

                            <li className="flex gap-2">
                                <span className="font-bold text-[#0F766E]">✓</span>
                                Send emails only to recipients who have agreed to receive them.
                            </li>
                        </ul>
                    </div>

                    {/* Privacy Information */}
                    <div className="card-animation rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F2A] text-lg text-[#2DD4BF]">
                                🔒
                            </div>

                            <h3 className="font-semibold text-[#0B1F2A]">
                                Recipient Privacy
                            </h3>
                        </div>

                        <p className="mt-3 text-xs leading-6 text-slate-500">
                            Your backend sends recipients using BCC, helping
                            prevent recipients from seeing one another's
                            email addresses.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SendEmail;
