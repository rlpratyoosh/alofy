"use client";

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    Copy,
    ExternalLink,
    Key,
    Shield,
    Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlitchText } from "../../../components/GlitchTextComponent";
import TopBar from "../../../components/TopBar";

const Step = ({
    number,
    title,
    description,
    children,
}: {
    number: number;
    title: string;
    description: string;
    children?: React.ReactNode;
}) => (
    <div className="flex gap-3 md:gap-4 p-4 md:p-6 bg-card border border-border rounded-lg hover:border-accent/30 transition-colors">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <span className="text-accent font-bold text-sm md:text-base">{number}</span>
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">{title}</h3>
            <p className="text-xs md:text-sm text-foreground/60 mb-2 md:mb-3">{description}</p>
            {children}
        </div>
    </div>
);

export default function GeminiApiKeyGuide() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col min-h-screen font-mono">
            <TopBar />

            <div className="flex-1 px-4 py-6 md:py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-6 md:mb-8 text-sm"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 md:mb-6">
                            <Key size={28} className="text-amber-400 md:w-8 md:h-8" />
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold tracking-wide text-foreground mb-3 md:mb-4">
                            Get Your Gemini API Key
                        </h1>
                        <p className="text-sm md:text-base text-foreground/60 max-w-lg mx-auto px-2">
                            Follow this simple guide to get your free Gemini API key from Google AI Studio and start
                            your adventure in Alofy.
                        </p>
                    </div>

                    {/* Info Banner */}
                    <div className="p-3 md:p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6 md:mb-8 flex items-start gap-2 md:gap-3">
                        <Sparkles size={18} className="text-green-400 shrink-0 mt-0.5 md:w-5 md:h-5" />
                        <div>
                            <h4 className="font-bold text-green-400 text-xs md:text-sm mb-1">Good News!</h4>
                            <p className="text-[10px] md:text-xs text-foreground/60">
                                Google offers a generous free tier for the Gemini API. You can play Alofy completely
                                free with the free quota!
                            </p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
                        <Step
                            number={1}
                            title="Go to Google AI Studio"
                            description="Visit the Google AI Studio website to access the Gemini API console."
                        >
                            <a
                                href="https://aistudio.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-accent font-bold text-xs uppercase tracking-wider hover:bg-accent/20 transition-all"
                            >
                                <span>Open Google AI Studio</span>
                                <ExternalLink size={14} />
                            </a>
                        </Step>

                        <Step
                            number={2}
                            title="Sign in with Google"
                            description="Sign in with your Google account. If you don't have one, you'll need to create one first."
                        >
                            <div className="flex items-center gap-2 text-xs text-foreground/50">
                                <CheckCircle size={14} className="text-green-400" />
                                <span>Any Google account works</span>
                            </div>
                        </Step>

                        <Step
                            number={3}
                            title="Get Your API Key"
                            description="Click on 'Get API Key' in the left sidebar, then click 'Create API Key' button."
                        >
                            <div className="p-3 bg-background rounded-lg border border-border">
                                <p className="text-xs text-foreground/50 mb-2">Look for this button:</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs font-bold">
                                    <Key size={12} />
                                    <span>Create API Key</span>
                                </div>
                            </div>
                        </Step>

                        <Step
                            number={4}
                            title="Copy Your API Key"
                            description="Once created, copy your API key. It will look something like this:"
                        >
                            <div className="p-3 bg-background rounded-lg border border-border flex items-center justify-between gap-3">
                                <code className="text-xs text-foreground/70 font-mono">
                                    AIzaSy**************************
                                </code>
                                <button
                                    onClick={() => copyToClipboard("AIzaSy**************************")}
                                    className="p-2 hover:bg-card rounded transition-colors"
                                    title="Copy example format"
                                >
                                    {copied ? (
                                        <CheckCircle size={14} className="text-green-400" />
                                    ) : (
                                        <Copy size={14} className="text-foreground/50" />
                                    )}
                                </button>
                            </div>
                        </Step>

                        <Step
                            number={5}
                            title="Add to Your Alofy Profile"
                            description="Go to your Alofy profile and paste the API key in the API Key field."
                        >
                            <button
                                onClick={() => router.push("/profile")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 font-bold text-xs uppercase tracking-wider hover:bg-purple-500/20 transition-all"
                            >
                                <span>Go to Profile</span>
                                <ChevronRight size={14} />
                            </button>
                        </Step>
                    </div>

                    {/* Security Note */}
                    <div className="p-4 md:p-6 bg-card border border-border rounded-lg mb-6 md:mb-8">
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                <Shield size={16} className="text-green-400 md:w-5 md:h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                                    Your API Key is Secure
                                </h3>
                                <p className="text-xs md:text-sm text-foreground/60 mb-2 md:mb-3">
                                    We take security seriously. Your API key is encrypted using AES-256 encryption
                                    before being stored. It&apos;s never exposed in plain text and is only decrypted
                                    when needed to make AI requests on your behalf.
                                </p>
                                <ul className="space-y-2 text-xs text-foreground/50">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className="text-green-400" />
                                        AES-256 encryption
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className="text-green-400" />
                                        Never stored in plain text
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className="text-green-400" />
                                        Only used for Alofy AI features
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Warning Note */}
                    <div className="p-3 md:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-6 md:mb-8 flex items-start gap-2 md:gap-3">
                        <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5 md:w-5 md:h-5" />
                        <div>
                            <h4 className="font-bold text-amber-400 text-xs md:text-sm mb-1">Keep Your Key Safe</h4>
                            <p className="text-[10px] md:text-xs text-foreground/60">
                                Never share your API key publicly. If you accidentally expose it, you can always revoke
                                it and create a new one in Google AI Studio.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={() => router.push("/menu")}
                            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-accent text-background font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 text-sm md:text-base"
                        >
                            <span>Start Playing</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="px-4 py-6 border-t border-border">
                <div className="text-center">
                    <GlitchText text="ALOFY" className="text-lg" />
                    <p className="text-xs text-foreground/40 mt-2">Bring Your Own Key • Play for Free</p>
                </div>
            </footer>
        </div>
    );
}
