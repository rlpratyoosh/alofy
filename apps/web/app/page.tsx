"use client";

import { useRouter } from "next/navigation";
import { GlitchText } from "../components/GlitchTextComponent";
import {
  Heart,
  Trophy,
  Swords,
  Code,
  Sparkles,
  ChevronRight,
  Gamepad2,
  Brain,
  Layers,
  User,
  Cpu,
  Zap,
} from "lucide-react";

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
  <div
    className={`p-5 bg-card border ${borderColor} rounded-lg hover:scale-105 transition-all duration-300 group`}
  >
    <div
      className={`w-12 h-12 rounded-lg bg-background border ${borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
    >
      <Icon size={24} className={color} />
    </div>
    <h3 className={`font-bold tracking-wide ${color} text-sm mb-2`}>{title}</h3>
    <p className="text-xs text-foreground/60 leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({
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
  <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
    <Icon size={20} className={color} />
    <div>
      <span className={`font-bold text-lg ${color}`}>{value}</span>
      <p className="text-[10px] text-foreground/50 uppercase tracking-wider">
        {label}
      </p>
    </div>
  </div>
);

const ClassBadge = ({
  name,
  color,
  bgColor,
}: {
  name: string;
  color: string;
  bgColor: string;
}) => (
  <span
    className={`px-3 py-1.5 ${bgColor} ${color} text-xs font-bold uppercase tracking-wider rounded-lg border border-current/20`}
  >
    {name}
  </span>
);

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative">
        {/* Decorative grid background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2b324520_1px,transparent_1px),linear-gradient(to_bottom,#2b324520_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center">
            <GlitchText text="ALOFY" className="text-6xl md:text-8xl" />
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10 text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <p className="text-xl md:text-2xl text-accent font-bold tracking-wider mb-3">
            A new story for every new game.
          </p>
          <p className="text-sm text-foreground/60 max-w-md mx-auto">
            Text-based RPG powered by AI where you solve DSA challenges to
            become a coding legend
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <button
            onClick={() => router.push("/menu")}
            className="px-8 py-4 bg-accent text-background font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-all duration-200 flex items-center gap-3 group shadow-lg shadow-accent/20"
          >
            <Gamepad2
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>Start Your Journey</span>
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={() => router.push("/demo")}
            className="px-8 py-4 bg-card border border-border text-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-card/80 hover:border-accent/50 transition-all duration-200 flex items-center gap-3 group"
          >
            <Zap size={20} className="text-purple-400" />
            <span>Try Demo</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <StatCard
            icon={Layers}
            value="10"
            label="Levels"
            color="text-blue-400"
          />
          <StatCard
            icon={Heart}
            value="3"
            label="Hearts"
            color="text-red-400"
          />
          <StatCard
            icon={Swords}
            value="3"
            label="Hurdles"
            color="text-yellow-400"
          />
          <StatCard
            icon={Trophy}
            value="∞"
            label="Stories"
            color="text-green-400"
          />
        </div>
      </section>

      {/* What is Alofy Section */}
      <section className="px-4 py-20 bg-card/30 border-t border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
              <Cpu size={14} className="text-accent" />
              <span className="text-xs text-accent uppercase tracking-widest font-bold">
                AI-Powered Adventure
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-foreground mb-4">
              What is ALOFY?
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Alofy is a text-based RPG where every playthrough generates a
              unique story. Powered by AI, your journey unfolds based on your
              choices and coding skills.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="AI-Generated Stories"
              description="Every game creates a unique narrative tailored to your character and choices. No two adventures are the same."
              color="text-purple-400"
              borderColor="border-purple-500/20"
            />
            <FeatureCard
              icon={Code}
              title="DSA Challenges"
              description="Face hurdles that test your data structures and algorithms knowledge. Solve coding problems to progress through the story."
              color="text-blue-400"
              borderColor="border-blue-500/20"
            />
            <FeatureCard
              icon={Sparkles}
              title="Fun Learning"
              description="Master DSA concepts while enjoying an immersive RPG experience. Learning to code has never been this engaging."
              color="text-green-400"
              borderColor="border-green-500/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-foreground mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Steps */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-accent font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Create Your Character
                  </h3>
                  <p className="text-sm text-foreground/60">
                    Choose your race, name your hero, and select your class
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-accent font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Embark on Your Journey
                  </h3>
                  <p className="text-sm text-foreground/60">
                    Progress through 10 levels with AI-generated story content
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-accent font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Face the Hurdles
                  </h3>
                  <p className="text-sm text-foreground/60">
                    Solve DSA problems at levels 3, 6, and 9 to continue
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-green-400 mb-1">
                    Claim Victory
                  </h3>
                  <p className="text-sm text-foreground/60">
                    Complete all 10 levels to become a coding legend
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Character Classes */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                  <User size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    Choose Your Class
                  </h3>
                  <p className="text-xs text-foreground/50">
                    Your coding language of choice
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <ClassBadge
                  name="Python"
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                />
                <ClassBadge
                  name="Java"
                  color="text-orange-400"
                  bgColor="bg-orange-500/10"
                />
                <ClassBadge
                  name="C++"
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                />
              </div>
              <p className="text-xs text-foreground/50">
                Each class uses a different programming language to solve
                challenges. Pick the one you want to master!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Rules Section */}
      <section className="px-4 py-20 bg-card/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-foreground mb-4">
              The Rules of the Game
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-red-500/20 rounded-lg text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3].map((i) => (
                  <Heart
                    key={i}
                    size={24}
                    className="text-red-500 fill-red-500"
                  />
                ))}
              </div>
              <h3 className="font-bold text-red-400 mb-2">3 Hearts</h3>
              <p className="text-xs text-foreground/60">
                You start with 3 lives. Fail a hurdle and lose a heart. Lose all
                hearts and it&apos;s game over.
              </p>
            </div>

            <div className="p-6 bg-card border border-yellow-500/20 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Swords size={48} className="text-yellow-400" />
              </div>
              <h3 className="font-bold text-yellow-400 mb-2">3 Hurdles</h3>
              <p className="text-xs text-foreground/60">
                Boss battles at levels 3, 6, and 9. Each one tests your coding
                skills with DSA challenges.
              </p>
            </div>

            <div className="p-6 bg-card border border-blue-500/20 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Layers size={48} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-blue-400 mb-2">10 Levels</h3>
              <p className="text-xs text-foreground/60">
                Journey through 10 unique levels, each with AI-generated story
                content and challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-foreground mb-4">
            Ready to Begin?
          </h2>
          <p className="text-foreground/60 mb-8">
            Your unique adventure awaits. Create your character, face the
            challenges, and become a coding legend.
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="px-10 py-5 bg-accent text-background font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-all duration-200 flex items-center gap-3 group shadow-lg shadow-accent/20 mx-auto"
          >
            <Gamepad2
              size={24}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="text-lg">Enter the Game</span>
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <GlitchText text="ALOFY" className="text-xl" />
          </div>
          <p className="text-xs text-foreground/40">
            A text-based RPG adventure • Bringing fun to DSA learning
          </p>
        </div>
      </footer>
    </div>
  );
}
