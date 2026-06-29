"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";


type LoginStep = "password" | "mfa" | "forgot_password";

export default function LoginPage() {
    const router = useRouter();
    const user = useUser();


    const [step, setStep] = useState<LoginStep>("password");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSuccess, setForgotSuccess] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const goToStep = (next: LoginStep) => {
        setError(null);
        setStep(next);
    };

    useEffect(() => {
        if (step === "mfa") {
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }
    }, [step]);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email,
                    password,
                    rememberMe: false,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.error ||
                        "Invalid email or password. Please try again.",
                );
                return;
            }

            if (data.token) {
                goToStep("mfa");
            } else {
                setError("MFA is required for admin accounts");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                otpRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
            if (otpRefs.current[i]) {
                otpRefs.current[i]!.value = pastedData[i];
            }
        }
        setOtp(newOtp);

        const focusIndex = Math.min(pastedData.length, 5);
        otpRefs.current[focusIndex]?.focus();
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/verify-2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.error ||
                        "Invalid verification code. Please try again.",
                );
                return;
            }

            // User is fetched via context on next refresh
            // We just need to trigger the refresh and navigation
            router.refresh();
            router.push("/dashboard");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) {
            setError("Please enter your email");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail }),
            });
            setForgotSuccess(true);
        } catch {
            setForgotSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-page px-4 font-sans antialiased">
            {/* Title above the Card */}
            <h1 className="mb-[22px] text-[20px] font-semibold text-text tracking-tight text-center">
                HomeBy Admin
            </h1>

            {/* Main Authentication Card */}
            <div className="w-full max-w-[360px] bg-card p-6 rounded-[6px] border border-border shadow-sm transition-all duration-150">
                {/* Error Notification Banner */}
                {error && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-[4px] bg-red-50 p-2.5 text-xs text-danger border border-red-100">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <div className="flex-1 font-medium">{error}</div>
                    </div>
                )}

                {/* Step 1: Password Login Form */}
                {step === "password" && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-text mb-1 leading-none">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-border rounded-[4px] px-3 h-[40px] text-sm text-text font-normal placeholder-muted/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-white transition-all"
                                placeholder="Enter your email"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-semibold text-text leading-none">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => goToStep("forgot_password")}
                                    className="text-xs font-medium text-accent hover:underline focus:outline-none transition-colors cursor-pointer"
                                    disabled={loading}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-border rounded-[4px] px-3 pr-10 h-[40px] text-sm text-text font-normal placeholder-muted/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-white transition-all"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-text transition-colors focus:outline-none cursor-pointer"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent text-white h-[40px] rounded-[4px] font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-accent cursor-pointer"
                            >
                                {loading ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Continue"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: MFA Verification Form */}
                {step === "mfa" && (
                    <form onSubmit={handleMfaSubmit} className="space-y-4">
                        <div className="text-center space-y-1 mb-1">
                            <h2 className="text-sm font-semibold text-text">
                                Two-Factor Verification
                            </h2>
                            <p className="text-xs text-muted leading-normal px-1">
                                Enter the 6-digit verification code from your
                                authenticator app.
                            </p>
                        </div>

                        <div className="flex justify-between gap-2 my-4">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => {
                                        otpRefs.current[idx] = el;
                                    }}
                                    onChange={(e) =>
                                        handleOtpChange(idx, e.target.value)
                                    }
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    onPaste={
                                        idx === 0 ? handleOtpPaste : undefined
                                    }
                                    className="w-10 h-10 text-center text-md font-semibold border border-border rounded-[4px] focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-white transition-all text-text"
                                    disabled={loading}
                                    required
                                />
                            ))}
                        </div>

                        <div className="space-y-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent text-white h-[40px] rounded-[4px] font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-accent cursor-pointer"
                            >
                                {loading ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Verify Code"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => goToStep("password")}
                                disabled={loading}
                                className="w-full bg-transparent border border-border text-muted hover:text-text hover:bg-page h-[40px] rounded-[4px] font-medium text-xs transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Password
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Forgot Password Form */}
                {step === "forgot_password" && (
                    <div className="space-y-4">
                        {!forgotSuccess ? (
                            <form
                                onSubmit={handleForgotPasswordSubmit}
                                className="space-y-4"
                            >
                                <div className="text-center space-y-1 mb-1">
                                    <h2 className="text-sm font-semibold text-text">
                                        Reset Password
                                    </h2>
                                    <p className="text-xs text-muted leading-normal px-2">
                                        Enter your email below and we&apos;ll
                                        send you a secure link to reset your
                                        password.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text mb-1 leading-none">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) =>
                                            setForgotEmail(e.target.value)
                                        }
                                        className="w-full border border-border rounded-[4px] px-3 h-[40px] text-sm text-text font-normal placeholder-muted/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-white transition-all"
                                        placeholder="Enter your email"
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-accent text-white h-[40px] rounded-[4px] font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {loading ? (
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "Send reset link"
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            goToStep("password");
                                            setForgotEmail("");
                                        }}
                                        disabled={loading}
                                        className="w-full bg-transparent border border-border text-muted hover:text-text hover:bg-page h-[40px] rounded-[4px] font-medium text-xs transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <ArrowLeft className="h-3.5 w-3.5" />
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-2 space-y-3">
                                <div className="flex justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-success" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold text-text">
                                        Link Sent Successfully!
                                    </h2>
                                    <p className="text-xs text-muted leading-normal px-2">
                                        A secure password reset link has been
                                        dispatched to{" "}
                                        <strong className="text-text font-semibold">
                                            {forgotEmail}
                                        </strong>
                                        .
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        goToStep("password");
                                        setForgotSuccess(false);
                                        setForgotEmail("");
                                    }}
                                    className="w-full bg-accent text-white h-[40px] rounded-[4px] font-medium text-sm hover:bg-blue-700 transition-all duration-150 flex items-center justify-center cursor-pointer"
                                >
                                    Return to Login
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer metadata text under the card */}
            <div className="mt-[22px] text-center text-[12px] font-normal text-muted tracking-tight">
                HomeBy Admin · Authorised staff only
            </div>
        </div>
    );
}
