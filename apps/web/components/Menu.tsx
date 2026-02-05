"use client";

import { Character, Game } from "@repo/db";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/client-api";
import useAuth from "../hooks/useAuth";
import {
  Maximize2,
  Minus,
  X,
  Gamepad2,
  Scroll,
  Play,
  Info,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Trophy,
  Heart,
  Cpu,
  User,
  Shield,
  LogIn,
  UserCircle,
} from "lucide-react";

const TitleBar = ({
  title,
  onClose,
}: {
  title: string;
  onClose?: () => void;
}) => (
  <div className="h-9 bg-[#1e2538] border-b border-border flex items-center justify-between px-3 select-none shrink-0">
    <div className="flex items-center gap-2 group">
      <button
        onClick={onClose}
        className={`w-3 h-3 rounded-full bg-red-500/20 ${onClose ? "group-hover:bg-red-500 cursor-pointer" : "cursor-not-allowed"} border border-red-500/50 transition-colors flex items-center justify-center`}
      >
        <X size={8} className="opacity-0 group-hover:opacity-100 text-black" />
      </button>
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

const menuItems = [
  {
    id: 1,
    name: "NEW GAME",
    description: "Start a new adventure",
    path: "/game/create",
    icon: Gamepad2,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    hoverBg: "hover:bg-green-500/20",
  },
  {
    id: 2,
    name: "GAME LOGS",
    description: "View your adventure history",
    path: "/game/log",
    icon: Scroll,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBg: "hover:bg-blue-500/20",
  },
  {
    id: 3,
    name: "DEMO",
    description: "Try the gameplay",
    path: "/demo",
    icon: Play,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    hoverBg: "hover:bg-purple-500/20",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "NOT_STARTED":
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
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

export default function Menu() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [games, setGames] = useState<GameWithCharacter[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState("");

  const fetchContinuableGames = async () => {
    setLoadingGames(true);
    setError("");
    try {
      const response = await api.get("/game");
      const gamesData: Game[] = response.data;

      // Filter for IN_PROGRESS or NOT_STARTED games
      const continuableGames = gamesData.filter(
        (game) =>
          game.status === "IN_PROGRESS" || game.status === "NOT_STARTED",
      );

      // Fetch characters for each game
      const gamesWithCharacters = await Promise.all(
        continuableGames.map(async (game) => {
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
      setLoadingGames(false);
    }
  };

  useEffect(() => {
    if (showContinueModal) {
      fetchContinuableGames();
    }
  }, [showContinueModal]);

  const handleOpenContinue = () => {
    setShowContinueModal(true);
  };

  const handleCloseContinue = () => {
    setShowContinueModal(false);
    setGames([]);
    setError("");
  };

  return (
    <>
      <div className="w-full max-w-lg bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TitleBar title="main_menu.exe" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
              <Sparkles size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-foreground">
                MAIN MENU
              </h2>
              <p className="text-xs text-foreground/50 uppercase tracking-widest">
                Select an option to continue
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleOpenContinue}
            className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 text-left group flex items-center gap-4 mb-3"
          >
            <div className="w-12 h-12 rounded-lg bg-card border border-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <RefreshCw size={24} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold tracking-wide text-yellow-400 text-sm">
                CONTINUE
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Resume an existing adventure
              </p>
            </div>
            <ChevronRight
              size={20}
              className="text-foreground/30 group-hover:text-foreground/70 transition-colors"
            />
          </button>

          {/* Menu Buttons */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full p-4 ${item.bgColor} border ${item.borderColor} rounded-lg ${item.hoverBg} transition-all duration-200 text-left group flex items-center gap-4`}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-card border ${item.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <item.icon size={24} className={item.color} />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold tracking-wide ${item.color} text-sm`}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-foreground/30 group-hover:text-foreground/70 transition-colors"
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Login / Profile Button */}
          {authLoading ? (
            <div className="w-full p-3 bg-background border border-border rounded-lg flex items-center justify-center gap-2 mb-3">
              <Cpu className="animate-pulse w-4 h-4 text-foreground/50" />
              <span className="text-xs text-foreground/50">Loading...</span>
            </div>
          ) : user ? (
            <button
              onClick={() => router.push("/profile")}
              className="w-full p-3 bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-all duration-200 text-left group flex items-center gap-3 mb-3"
            >
              <div className="w-8 h-8 rounded-full bg-card border border-accent/20 flex items-center justify-center group-hover:border-accent/50 transition-colors overflow-hidden">
                {user.profile?.avatarUrl ? (
                  <img
                    src={user.profile.avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle size={14} className="text-accent" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-accent uppercase tracking-wider group-hover:text-accent/80 transition-colors">
                  Profile
                </span>
                <p className="text-[10px] text-foreground/50 mt-0.5">
                  {user.profile?.displayName || user.username}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="ml-auto text-accent/30 group-hover:text-accent/70 transition-colors"
              />
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="w-full p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-200 text-left group flex items-center gap-3 mb-3"
            >
              <div className="w-8 h-8 rounded-full bg-card border border-green-500/20 flex items-center justify-center group-hover:border-green-500/50 transition-colors">
                <LogIn size={14} className="text-green-400" />
              </div>
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider group-hover:text-green-300 transition-colors">
                Login
              </span>
              <ChevronRight
                size={16}
                className="ml-auto text-green-400/30 group-hover:text-green-400/70 transition-colors"
              />
            </button>
          )}

          {/* About Button */}
          <button
            onClick={() => router.push("/about")}
            className="w-full p-3 bg-background border border-border rounded-lg hover:bg-card transition-all duration-200 text-left group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
              <Info size={14} className="text-foreground/50" />
            </div>
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider group-hover:text-foreground/70 transition-colors">
              About Alofy
            </span>
            <ChevronRight
              size={16}
              className="ml-auto text-foreground/20 group-hover:text-foreground/50 transition-colors"
            />
          </button>
        </div>
      </div>

      {/* Continue Modal Overlay */}
      {showContinueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleCloseContinue}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-card rounded-lg border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <TitleBar title="continue_game.exe" onClose={handleCloseContinue} />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <RefreshCw size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-foreground">
                    CONTINUE GAME
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest">
                    Select a game to resume
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                  <X size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              {/* Loading State */}
              {loadingGames ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Cpu className="animate-pulse w-10 h-10 text-accent" />
                  <span className="text-xs tracking-widest text-foreground/50">
                    LOADING GAMES...
                  </span>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-2">
                  {games.length === 0 ? (
                    <div className="text-center py-12 text-foreground/50 text-sm">
                      <Gamepad2 size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-bold tracking-wide">
                        No games to continue
                      </p>
                      <p className="text-xs mt-2">
                        Start a new adventure first
                      </p>
                    </div>
                  ) : (
                    games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => router.push(`/game/${game.id}`)}
                        className="w-full p-4 bg-background border border-border rounded-lg hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Character Avatar */}
                            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-yellow-500/50 transition-colors shrink-0">
                              {game.character ? (
                                getRaceIcon(game.character.race)
                              ) : (
                                <Gamepad2 size={20} className="text-accent" />
                              )}
                            </div>

                            {/* Game Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
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
                                  <Trophy
                                    size={12}
                                    className="text-yellow-400"
                                  />
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
                              </div>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="ml-4 shrink-0">
                            <ChevronRight
                              size={20}
                              className="text-foreground/30 group-hover:text-yellow-400 transition-colors"
                            />
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
