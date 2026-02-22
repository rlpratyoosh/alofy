"use client";

import {
    ArrowLeft,
    Brain,
    Code,
    ExternalLink,
    Gamepad2,
    Github,
    Heart,
    Key,
    Layers,
    Linkedin,
    Lock,
    Shield,
    Sparkles,
    Swords,
    Trophy,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GlitchText } from "../../components/GlitchTextComponent";
import TopBar from "../../components/TopBar";

const FeatureCard = ({
    icon: Icon,
    title,
    description,
    color,
    borderColor,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    description: string;
    color: string;
    borderColor: string;
}) => (
    <div className={`p-5 bg-card border ${borderColor} rounded-lg hover:scale-105 transition-all duration-300 group`}>
        <div
            className={`w-12 h-12 rounded-lg bg-background border ${borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
        >
            <Icon size={24} className={color} />
        </div>
        <h3 className={`font-bold tracking-wide ${color} text-sm mb-2`}>{title}</h3>
        <p className="text-xs text-foreground/60 leading-relaxed">{description}</p>
    </div>
);

const StatBadge = ({
    icon: Icon,
    value,
    label,
    color,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    value: string;
    label: string;
    color: string;
}) => (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
        <Icon size={20} className={color} />
        <div>
            <span className={`font-bold text-lg ${color}`}>{value}</span>
            <p className="text-[10px] text-foreground/50 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const TechBadge = ({ name }: { name: string }) => (
    <span className="px-3 py-1.5 bg-card border border-border text-xs font-bold uppercase tracking-wider rounded-lg text-foreground/70 hover:border-accent/50 transition-colors">
        {name}
    </span>
);

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen font-mono">
            <TopBar />

            <div className="flex-1 px-4 py-6 md:py-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-6 md:mb-8 text-sm"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>

                    {/* Hero Section */}
                    <div className="text-center mb-10 md:mb-16">
                        <div className="mb-4 md:mb-6">
                            <GlitchText text="ALOFY" className="text-4xl md:text-6xl" />
                        </div>
                        <p className="text-lg md:text-xl text-accent font-bold tracking-wider mb-2 md:mb-3">
                            A new story for every new game.
                        </p>
                        <p className="text-xs md:text-sm text-foreground/60 max-w-lg mx-auto px-2">
                            AI-Powered Text-Based RPG where you solve Data Structures and Algorithms challenges to
                            become a coding legend.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16">
                        <StatBadge icon={Layers} value="10" label="Levels" color="text-blue-400" />
                        <StatBadge icon={Heart} value="3" label="Hearts" color="text-red-400" />
                        <StatBadge icon={Swords} value="3" label="Hurdles" color="text-yellow-400" />
                        <StatBadge icon={Trophy} value="∞" label="Stories" color="text-green-400" />
                    </div>

                    {/* What is Alofy */}
                    <section className="mb-10 md:mb-16">
                        <h2 className="text-lg md:text-xl font-bold tracking-wide text-foreground mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                            <Gamepad2 size={18} className="text-accent md:w-5 md:h-5" />
                            What is Alofy?
                        </h2>
                        <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-4 md:mb-6">
                            Alofy is a text-based RPG game where every playthrough generates a unique story powered by
                            AI. Your journey unfolds based on your choices and coding skills as you face Data Structures
                            and Algorithms (DSA) challenges to progress through the adventure.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            <FeatureCard
                                icon={Brain}
                                title="AI-Generated Stories"
                                description="Every game creates a unique narrative tailored to your character and choices."
                                color="text-purple-400"
                                borderColor="border-purple-500/20"
                            />
                            <FeatureCard
                                icon={Code}
                                title="DSA Challenges"
                                description="Face hurdles that test your data structures and algorithms knowledge."
                                color="text-blue-400"
                                borderColor="border-blue-500/20"
                            />
                            <FeatureCard
                                icon={Sparkles}
                                title="Fun Learning"
                                description="Master DSA concepts while enjoying an immersive RPG experience."
                                color="text-green-400"
                                borderColor="border-green-500/20"
                            />
                        </div>
                    </section>

                    {/* BYOK Section */}
                    <section className="mb-10 md:mb-16">
                        <h2 className="text-lg md:text-xl font-bold tracking-wide text-foreground mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                            <Key size={18} className="text-amber-400 md:w-5 md:h-5" />
                            Bring Your Own Key (BYOK)
                        </h2>
                        <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-4 md:mb-6">
                            Unlike other AI-powered games, Alofy uses YOUR Gemini API key. This means complete
                            transparency, no hidden costs, and full control over your AI usage.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="p-5 bg-card border border-amber-500/20 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                                    <Shield size={24} className="text-amber-400" />
                                </div>
                                <h3 className="font-bold text-amber-400 text-sm mb-2">Full Transparency</h3>
                                <p className="text-xs text-foreground/60 leading-relaxed">
                                    See exactly how the AI is being used. Your API key, your usage, your control.
                                </p>
                            </div>
                            <div className="p-5 bg-card border border-green-500/20 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                                    <Lock size={24} className="text-green-400" />
                                </div>
                                <h3 className="font-bold text-green-400 text-sm mb-2">Secure & Encrypted</h3>
                                <p className="text-xs text-foreground/60 leading-relaxed">
                                    Your API key is encrypted with AES-256 encryption. We never store it in plain text.
                                </p>
                            </div>
                            <div className="p-5 bg-card border border-blue-500/20 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                    <Zap size={24} className="text-blue-400" />
                                </div>
                                <h3 className="font-bold text-blue-400 text-sm mb-2">Free Tier Available</h3>
                                <p className="text-xs text-foreground/60 leading-relaxed">
                                    Google&apos;s Gemini API offers a generous free tier. Play for free!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/guide/gemini-api-key")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-bold text-xs uppercase tracking-wider hover:bg-amber-500/20 transition-all"
                        >
                            <Key size={14} />
                            <span>Learn How to Get Your API Key</span>
                            <ExternalLink size={12} />
                        </button>
                    </section>

                    {/* Tech Stack */}
                    <section className="mb-10 md:mb-16">
                        <h2 className="text-lg md:text-xl font-bold tracking-wide text-foreground mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                            <Code size={18} className="text-blue-400 md:w-5 md:h-5" />
                            Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                            <TechBadge name="Next.js" />
                            <TechBadge name="NestJS" />
                            <TechBadge name="TypeScript" />
                            <TechBadge name="TurboRepo" />
                            <TechBadge name="PostgreSQL" />
                            <TechBadge name="Redis" />
                            <TechBadge name="Prisma" />
                            <TechBadge name="Docker" />
                            <TechBadge name="Socket.io" />
                            <TechBadge name="Tailwind CSS" />
                            <TechBadge name="Monaco Editor" />
                            <TechBadge name="Gemini AI" />
                        </div>
                    </section>

                    {/* Character Classes */}
                    <section className="mb-10 md:mb-16">
                        <h2 className="text-lg md:text-xl font-bold tracking-wide text-foreground mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                            <Sparkles size={18} className="text-purple-400 md:w-5 md:h-5" />
                            Character Classes
                        </h2>
                        <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-4 md:mb-6">
                            Choose your coding language of choice to battle the DSA challenges:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 bg-card border border-yellow-500/20 rounded-lg text-center">
                                <span className="text-3xl mb-3 block">🐍</span>
                                <h3 className="font-bold text-yellow-400 text-sm mb-1">Python</h3>
                                <p className="text-xs text-foreground/50">Python 3.x</p>
                            </div>
                            <div className="p-5 bg-card border border-orange-500/20 rounded-lg text-center">
                                <span className="text-3xl mb-3 block">☕</span>
                                <h3 className="font-bold text-orange-400 text-sm mb-1">Java</h3>
                                <p className="text-xs text-foreground/50">Java 15.x</p>
                            </div>
                            <div className="p-5 bg-card border border-blue-500/20 rounded-lg text-center">
                                <span className="text-3xl mb-3 block">⚡</span>
                                <h3 className="font-bold text-blue-400 text-sm mb-1">C++</h3>
                                <p className="text-xs text-foreground/50">C++ 10.x</p>
                            </div>
                        </div>
                    </section>

                    {/* Creator */}
                    <section className="mb-10 md:mb-16">
                        <h2 className="text-lg md:text-xl font-bold tracking-wide text-foreground mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                            <Heart size={18} className="text-red-400 md:w-5 md:h-5" />
                            Creator
                        </h2>
                        <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
                            <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-3 md:mb-4">
                                Made with ❤️ by <span className="text-accent font-bold">Pratyoosh</span>
                            </p>
                            <p className="text-xs md:text-sm text-foreground/50 mb-4 md:mb-6">
                                Bringing fun to DSA learning through immersive gameplay experiences.
                            </p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <a
                                    href="https://github.com/rlpratyoosh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-background border border-border rounded-lg text-foreground/70 font-bold text-[10px] md:text-xs uppercase tracking-wider hover:bg-card hover:border-accent/50 transition-all"
                                >
                                    <Github size={12} className="md:w-3.5 md:h-3.5" />
                                    <span>GitHub</span>
                                </a>
                                <a
                                    href="https://linkedin.com/in/rlpratyoosh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-background border border-border rounded-lg text-foreground/70 font-bold text-[10px] md:text-xs uppercase tracking-wider hover:bg-card hover:border-accent/50 transition-all"
                                >
                                    <Linkedin size={12} className="md:w-3.5 md:h-3.5" />
                                    <span>LinkedIn</span>
                                </a>
                                <a
                                    href="https://github.com/rlpratyoosh/alofy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-accent/10 border border-accent/30 rounded-lg text-accent font-bold text-[10px] md:text-xs uppercase tracking-wider hover:bg-accent/20 transition-all"
                                >
                                    <Github size={12} className="md:w-3.5 md:h-3.5" />
                                    <span className="hidden sm:inline">View Source</span>
                                    <span className="sm:hidden">Source</span>
                                    <ExternalLink size={10} className="md:w-3 md:h-3" />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={() => router.push("/menu")}
                            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-accent text-background font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 text-sm md:text-base"
                        >
                            <Gamepad2 size={18} className="md:w-5 md:h-5" />
                            <span>Start Playing</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="px-4 py-6 border-t border-border shrink-0">
                <div className="text-center">
                    <GlitchText text="ALOFY" className="text-lg" />
                    <p className="text-xs text-foreground/40 mt-2">A new story for every new game • Powered by AI</p>
                </div>
            </footer>
        </div>
    );
}
