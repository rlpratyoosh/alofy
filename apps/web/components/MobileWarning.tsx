"use client";

import { ChevronRight, Gamepad2, Monitor, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlitchText } from "./GlitchTextComponent";

export default function MobileWarning() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-mono bg-background md:hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#2b324520_1px,transparent_1px),linear-gradient(to_bottom,#2b324520_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Icon Container */}
                <div className="relative mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20">
                        <Monitor size={40} className="text-accent" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center">
                        <Smartphone size={18} className="text-foreground/50" />
                    </div>
                </div>

                {/* Logo */}
                <div className="mb-6">
                    <GlitchText text="ALOFY" className="text-4xl" />
                </div>

                {/* Message */}
                <h1 className="text-xl font-bold tracking-wide text-foreground mb-3">Best on Desktop</h1>
                <p className="text-sm text-foreground/60 max-w-xs mx-auto mb-8 leading-relaxed">
                    For the best gaming experience with our code editor and interactive features, please visit us on a
                    PC or laptop.
                </p>

                {/* Features that need PC */}
                <div className="mb-8 p-4 bg-card border border-border rounded-lg max-w-xs mx-auto">
                    <h3 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-3">
                        Features requiring desktop:
                    </h3>
                    <ul className="space-y-2 text-left">
                        <li className="flex items-center gap-2 text-xs text-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>Full Code Editor</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>Split-panel Game Interface</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>Code Execution & Testing</span>
                        </li>
                    </ul>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/menu")}
                        className="w-full max-w-xs px-6 py-3 bg-accent text-background font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <Gamepad2 size={18} />
                        <span>Go to Menu</span>
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full max-w-xs px-6 py-3 bg-card border border-border text-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-card/80 transition-all duration-200 text-sm"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Note */}
                <p className="text-xs text-foreground/40 mt-8 max-w-xs mx-auto">
                    You can still browse the menu, view your profile, and manage your account on mobile.
                </p>
            </div>
        </div>
    );
}
