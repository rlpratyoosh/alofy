"use client";

import { Character, Game } from "@repo/db";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/client-api";
import {
  Maximize2,
  Minus,
  X,
  Cpu,
  Gamepad2,
  Trophy,
  Heart,
  ChevronRight,
  AlertCircle,
  Clock,
  Scroll,
  Sparkles,
  User,
  Shield,
  ArrowLeft,
} from "lucide-react";
import TopBar from "./TopBar";

const TitleBar = ({ title }: { title: string }) => (
  <div className="h-9 bg-[#1e2538] border-b border-border flex items-center justify-between px-3 select-none shrink-0">
    <div className="flex items-center gap-2 group">
      <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 border border-red-500/50 transition-colors cursor-not-allowed flex items-center justify-center">
        <X size={8} className="opacity-0 group-hover:opacity-100 text-black" />
      </div>
      <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 border border-yellow-500/50 transition-colors flex items-center justify-center cursor-not-allowed">
        <Minus
          size={8}
          className="opacity-0 group-hover:opacity-100 text-black"
        />
      </div>
      <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500 border border-green-500/50 transition-colors flex items-center justify-center cursor-not-allowed">
        <Maximize2
          size={8}
          className="opacity-0 group-hover:opacity-100 text-black"
        />
      </div>
    </div>
    <span className="text-xs text-gray-400 font-medium tracking-wide">
      {title}
    </span>
    <div className="w-12" />
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "ENDED":
      return "text-green-400 bg-green-500/10 border-green-500/20";
    case "GAME_OVER":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "ENDED":
      return "Victory";
    case "GAME_OVER":
      return "Game Over";
    case "NOT_STARTED":
      return "Not Started";
    default:
      return status;
  }
};

const getRaceIcon = (race: string) => {
  switch (race) {
    case "elf":
      return <Sparkles size={16} className="text-purple-400" />;
    case "human":
      return <User size={16} className="text-blue-400" />;
    case "dwarf":
      return <Shield size={16} className="text-amber-400" />;
    default:
      return <User size={16} />;
  }
};

const getClassLabel = (cls: string) => {
  switch (cls) {
    case "cpp":
      return "C++";
    case "java":
      return "Java";
    case "python":
      return "Python";
    default:
      return cls;
  }
};

type GameWithCharacter = Game & { character?: Character };

export default function GameLog() {
  const router = useRouter();
  const [games, setGames] = useState<GameWithCharacter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await api.get("/game");
        const gamesData: Game[] = response.data;

        // Fetch characters for each game
        const gamesWithCharacters = await Promise.all(
          gamesData.map(async (game) => {
            try {
              const charResponse = await api.get(
                `/character/${game.characterId}`,
              );
              return { ...game, character: charResponse.data };
            } catch {
              return { ...game, character: undefined };
            }
          }),
        );

        setGames(gamesWithCharacters);
      } catch (er) {
        if (er instanceof AxiosError) {
          setError(er.response?.data?.message || "Failed to load games");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Auto-dismiss error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <Cpu className="animate-pulse w-12 h-12 text-accent" />
            <span className="text-sm tracking-widest text-foreground/70">
              LOADING GAME LOGS...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
      <TopBar />

      {/* Error Toast */}
      {error && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg shadow-xl backdrop-blur-sm flex items-center gap-3">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-400 font-medium">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-2 p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X size={14} className="text-red-400" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-3xl bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TitleBar title="game_logs.db" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                  <Scroll size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-foreground">
                    GAME LOGS
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest">
                    Your adventure history
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/menu")}
                className="px-4 py-2 bg-card text-foreground text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-950 transition-all duration-200 border border-border flex items-center gap-2"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            </div>

            {/* Game List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-2">
              {games.length === 0 ? (
                <div className="text-center py-12 text-foreground/50 text-sm">
                  <Gamepad2 size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-bold tracking-wide">No games found</p>
                  <p className="text-xs mt-2">
                    Start a new adventure to see it here
                  </p>
                </div>
              ) : (
                games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => router.push(`/game/${game.id}`)}
                    className="w-full p-4 bg-background border border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Character Avatar */}
                        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors shrink-0">
                          {game.character ? (
                            getRaceIcon(game.character.race)
                          ) : (
                            <Gamepad2 size={20} className="text-accent" />
                          )}
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Character Name */}
                            {game.character && (
                              <span className="font-bold text-foreground tracking-wide">
                                {game.character.name}
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(game.status)}`}
                            >
                              {getStatusLabel(game.status)}
                            </span>
                          </div>

                          {/* Character Details */}
                          {game.character && (
                            <p className="text-xs text-foreground/50 capitalize mb-1">
                              {game.character.race} ·{" "}
                              {getClassLabel(game.character.class)} · Level{" "}
                              {game.curLevel}
                            </p>
                          )}

                          {/* Stats Row */}
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                              <Trophy size={12} className="text-yellow-400" />
                              <span>{game.point} pts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(3)].map((_, i) => (
                                <Heart
                                  key={i}
                                  size={10}
                                  className={`${
                                    i < game.lives
                                      ? "text-red-500 fill-red-500"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-foreground/40">
                              <Clock size={10} />
                              <span>{formatDate(game.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="ml-4 shrink-0">
                        <ChevronRight
                          size={20}
                          className="text-foreground/30 group-hover:text-accent transition-colors"
                        />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
