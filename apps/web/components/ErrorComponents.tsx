"use client";

import { AlertCircle, AlertTriangle, CreditCard, ExternalLink, Key, RefreshCw, Server, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export type ErrorType =
    | "AI_RATE_LIMIT"
    | "AI_INVALID_KEY"
    | "AI_QUOTA_EXCEEDED"
    | "AI_SERVICE_ERROR"
    | "API_KEY_REQUIRED"
    | "GENERIC";

interface ErrorModalProps {
    error: string;
    errorType?: ErrorType;
    onClose: () => void;
    onRetry?: () => void;
}

const getErrorConfig = (errorType: ErrorType) => {
    switch (errorType) {
        case "AI_RATE_LIMIT":
            return {
                icon: Zap,
                iconColor: "text-yellow-400",
                bgColor: "bg-yellow-500/10",
                borderColor: "border-yellow-500/30",
                title: "Rate Limit Exceeded",
                description: "You've made too many requests. Please wait a moment before trying again.",
                showRetry: true,
                showProfile: false,
                showGuide: false,
            };
        case "AI_INVALID_KEY":
            return {
                icon: Key,
                iconColor: "text-red-400",
                bgColor: "bg-red-500/10",
                borderColor: "border-red-500/30",
                title: "Invalid API Key",
                description: "Your API key is invalid or has expired. Please update it in your profile.",
                showRetry: false,
                showProfile: true,
                showGuide: true,
            };
        case "AI_QUOTA_EXCEEDED":
            return {
                icon: CreditCard,
                iconColor: "text-orange-400",
                bgColor: "bg-orange-500/10",
                borderColor: "border-orange-500/30",
                title: "API Quota Exceeded",
                description:
                    "Your API key has reached its usage limit. Please check your Gemini API quota or use a different key.",
                showRetry: false,
                showProfile: true,
                showGuide: true,
            };
        case "AI_SERVICE_ERROR":
            return {
                icon: Server,
                iconColor: "text-purple-400",
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/30",
                title: "AI Service Unavailable",
                description: "The AI service is temporarily unavailable. Please try again later.",
                showRetry: true,
                showProfile: false,
                showGuide: false,
            };
        case "API_KEY_REQUIRED":
            return {
                icon: Key,
                iconColor: "text-amber-400",
                bgColor: "bg-amber-500/10",
                borderColor: "border-amber-500/30",
                title: "API Key Required",
                description: "Please add your Gemini API key in your profile to start playing.",
                showRetry: false,
                showProfile: true,
                showGuide: true,
            };
        default:
            return {
                icon: AlertCircle,
                iconColor: "text-red-400",
                bgColor: "bg-red-500/10",
                borderColor: "border-red-500/30",
                title: "Something Went Wrong",
                description: "An unexpected error occurred. Please try again.",
                showRetry: true,
                showProfile: false,
                showGuide: false,
            };
    }
};

export function ErrorModal({ error, errorType = "GENERIC", onClose, onRetry }: ErrorModalProps) {
    const router = useRouter();
    const config = getErrorConfig(errorType);
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div
                className={`relative w-full max-w-lg bg-card rounded-xl border ${config.borderColor} shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
            >
                <div className={`${config.bgColor} border-b ${config.borderColor} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                                <Icon size={24} className={config.iconColor} />
                            </div>
                            <h3 className={`font-bold tracking-wide ${config.iconColor} uppercase text-sm`}>
                                {config.title}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card/50 transition-colors">
                            <X size={18} className="text-foreground/50" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">{config.description}</p>

                    {error && error !== config.description && (
                        <div className="p-3 bg-background rounded-lg border border-border">
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={14} className="text-foreground/50 shrink-0 mt-0.5" />
                                <p className="text-xs text-foreground/60 font-mono break-all">{error}</p>
                            </div>
                        </div>
                    )}

                    {config.showGuide && (
                        <button
                            onClick={() => router.push("/guide/gemini-api-key")}
                            className="w-full px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={12} />
                            <span>How to get a Gemini API Key</span>
                        </button>
                    )}

                    <div className="flex gap-3 pt-2">
                        {config.showProfile && (
                            <button
                                onClick={() => router.push("/profile")}
                                className={`flex-1 px-4 py-3 ${config.bgColor} border ${config.borderColor} rounded-lg ${config.iconColor} font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2`}
                            >
                                <Key size={16} />
                                Go to Profile
                            </button>
                        )}
                        {config.showRetry && onRetry && (
                            <button
                                onClick={() => {
                                    onRetry();
                                    onClose();
                                }}
                                className="flex-1 px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg text-accent font-bold text-xs uppercase tracking-wider hover:bg-accent/20 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground/70 font-bold text-xs uppercase tracking-wider hover:bg-card transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ErrorToast({
    error,
    errorType = "GENERIC",
    onClose,
    onAction,
}: {
    error: string;
    errorType?: ErrorType;
    onClose: () => void;
    onAction?: () => void;
}) {
    const config = getErrorConfig(errorType);
    const Icon = config.icon;

    return (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div
                className={`px-4 py-3 ${config.bgColor} border ${config.borderColor} rounded-xl shadow-2xl backdrop-blur-sm flex items-center gap-3 max-w-md`}
            >
                <Icon size={18} className={`${config.iconColor} shrink-0`} />
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${config.iconColor} uppercase`}>{config.title}</p>
                    <p className="text-xs text-foreground/70 truncate">{error}</p>
                </div>
                {config.showProfile && onAction && (
                    <button
                        onClick={onAction}
                        className={`px-3 py-1.5 ${config.bgColor} border ${config.borderColor} rounded-lg text-xs font-bold ${config.iconColor} hover:brightness-110 transition-all shrink-0`}
                    >
                        Fix
                    </button>
                )}
                <button onClick={onClose} className="p-1 hover:bg-card/50 rounded transition-colors shrink-0">
                    <X size={14} className="text-foreground/50" />
                </button>
            </div>
        </div>
    );
}

export function parseErrorType(errorResponse: unknown): ErrorType {
    if (typeof errorResponse === "object" && errorResponse !== null) {
        const err = errorResponse as Record<string, unknown>;
        if (typeof err.error === "string") {
            const errorCode = err.error as string;
            if (
                [
                    "AI_RATE_LIMIT",
                    "AI_INVALID_KEY",
                    "AI_QUOTA_EXCEEDED",
                    "AI_SERVICE_ERROR",
                    "API_KEY_REQUIRED",
                ].includes(errorCode)
            ) {
                return errorCode as ErrorType;
            }
        }
    }
    return "GENERIC";
}
