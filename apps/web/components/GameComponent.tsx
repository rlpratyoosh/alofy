"use client";

import Editor, { Monaco } from "@monaco-editor/react";
import { Character, Game } from "@repo/db";
import { Progress, Result } from "@repo/types";
import { AxiosError } from "axios";
import {
    Activity,
    AlertCircle,
    Battery,
    CheckCircle,
    ChevronRight,
    CirclePlay,
    Cpu,
    Gamepad2,
    Heart,
    Home,
    Maximize2,
    Minus,
    Shield,
    Signal,
    Skull,
    Sparkles,
    Trophy,
    User,
    UserCircle,
    Wifi,
    X,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import { api } from "../utils/client-api";
import { ErrorModal, ErrorType, parseErrorType } from "./ErrorComponents";
import { GlitchText } from "./GlitchTextComponent";

type Python = {
    name: "python";
    version: "3.x";
};

type Java = {
    name: "java";
    version: "15.x";
};

type Cpp = {
    name: "cpp";
    version: "10.x";
};

type StarterCode = {
    cpp: string;
    python: string;
    java: string;
};

const TitleBar = ({ title }: { title: string }) => (
    <div className="h-9 bg-[#1e2538] border-b border-border flex items-center justify-between px-3 select-none">
        <div className="flex items-center gap-2 group">
            <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 border border-red-500/50 transition-colors cursor-not-allowed flex items-center justify-center">
                <X size={8} className="opacity-0 group-hover:opacity-100 text-black" />
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 border border-yellow-500/50 transition-colors flex items-center justify-center cursor-not-allowed">
                <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black" />
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500 border border-green-500/50 transition-colors flex items-center justify-center cursor-not-allowed">
                <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-black" />
            </div>
        </div>
        <span className="text-xs text-gray-400 font-medium tracking-wide">{title}</span>
        <div className="w-12" />
    </div>
);

export default function GameComponent({ id }: { id: string }) {
    const router = useRouter();
    const { user: authUser, loading: authLoading } = useAuth();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [starting, setStarting] = useState<boolean>(false);
    const [character, setCharacter] = useState<Character | null>(null);
    const [error, setError] = useState<string>("");
    const [errorType, setErrorType] = useState<ErrorType>("GENERIC");
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [userCode, setUserCode] = useState<string>("");

    const [progress, setProgress] = useState<Progress | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [executed, setExecuted] = useState<boolean>(false);

    const [leftPanelWidth, setLeftPanelWidth] = useState(48);
    const [isDragging, setIsDragging] = useState(false);
    const [bottomBarHeight, setBottomBarHeight] = useState(100);
    const [isResizingBottom, setIsResizingBottom] = useState(false);

    const [language, setLanguage] = useState<Python | Java | Cpp | null>(null);

    const [currentTime, setCurrentTime] = useState<string>("");
    const [heartLost, setHeartLost] = useState<boolean>(false);

    const socket = useRef<Socket | null>(null);
    const currentLevelRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const editorPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.current = io();

        return () => {
            socket.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-dismiss error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const fetchGame = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/game/${id}`);
                setGame(response.data);
            } catch (er) {
                if (er instanceof AxiosError) setError(er.response?.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    useEffect(() => {
        const fetchCharacterAndCode = async () => {
            try {
                let fetchedCharacter = character;

                if (game && game.characterId && !character) {
                    const response = await api.get(`/character/${game.characterId}`);
                    fetchedCharacter = response.data;
                    setCharacter(response.data);
                    const charClass = response.data.class as "cpp" | "java" | "python";
                    switch (charClass) {
                        case "cpp":
                            setLanguage({ name: "cpp", version: "10.x" });
                            break;
                        case "java":
                            setLanguage({ name: "java", version: "15.x" });
                            break;
                        case "python":
                            setLanguage({ name: "python", version: "3.x" });
                            break;
                    }
                }

                // Only fetch starter code when entering a new level (level changed)
                if (
                    game &&
                    game.curLevel % 3 === 0 &&
                    game.curLevel !== 0 &&
                    game.curProblemSlug &&
                    currentLevelRef.current !== game.curLevel &&
                    fetchedCharacter
                ) {
                    currentLevelRef.current = game.curLevel;
                    const response = await api.get(`/game/problem/${game.curProblemSlug}`);
                    const code = response.data as StarterCode;
                    switch (fetchedCharacter.class) {
                        case "cpp":
                            setUserCode(code.cpp);
                            break;
                        case "java":
                            setUserCode(code.java);
                            break;
                        case "python":
                            setUserCode(code.python);
                            break;
                    }
                }
            } catch (er) {
                if (er instanceof AxiosError) setError(er.response?.data.message);
            }
        };

        fetchCharacterAndCode();
    }, [game, character]);

    const continueGame = async () => {
        setStarting(true);
        try {
            const response = await api.post("/game/continue", { gameId: id });
            setGame(response.data);
            setExecuted(false);
            setProgress(null);
            setResult(null);
        } catch (er) {
            if (er instanceof AxiosError) {
                const errType = parseErrorType(er.response?.data);
                setError(er.response?.data.message || "Failed to continue game");
                setErrorType(errType);
                setShowErrorModal(true);
            }
        } finally {
            setStarting(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleBottomResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingBottom(true);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

                if (newWidth > 20 && newWidth < 80) {
                    setLeftPanelWidth(newWidth);
                }
            }

            if (isResizingBottom && editorPanelRef.current) {
                const panelRect = editorPanelRef.current.getBoundingClientRect();
                const newHeight = panelRect.bottom - e.clientY;

                if (newHeight >= 60 && newHeight <= 300) {
                    setBottomBarHeight(newHeight);
                }
            }
        },
        [isDragging, isResizingBottom],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizingBottom(false);
    }, []);

    useEffect(() => {
        if (isDragging || isResizingBottom) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizingBottom, handleMouseMove, handleMouseUp]);

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme("alofy-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#161b2a",
                "editor.lineHighlightBackground": "#1e2538",
                "editorCursor.foreground": "#ddc7c3",
                "scrollbarSlider.background": "#33333340",
                "editorLineNumber.foreground": "#4b5563",
            },
        });
    };

    const getMonacoLanguage = (lang: Python | Java | Cpp | null) => {
        if (!lang) return "python";
        switch (lang.name) {
            case "python":
                return "python";
            case "java":
                return "java";
            case "cpp":
                return "cpp";
        }
    };

    const getLanguageDisplayName = (lang: Python | Java | Cpp | null) => {
        if (!lang) return "Python3";
        switch (lang.name) {
            case "python":
                return "Python3";
            case "java":
                return "Java";
            case "cpp":
                return "C++";
        }
    };

    const execute = async () => {
        if (!socket.current || !language || !game?.curProblemSlug) return;
        setExecuted(true);

        const socketId = socket.current.id;
        const data = {
            socketId,
            problemSlug: game.curProblemSlug,
            userCode,
            language: language.name,
            version: language.version,
            gameId: id,
        };

        const res = await api.post("/execute", data);
        const jobId = res.data;

        socket.current.on(`${jobId}-progress`, data => setProgress(data));
        socket.current.on(`${jobId}-result`, data => {
            setResult(data);
            if (data.type === "FAIL") {
                setHeartLost(true);
                setTimeout(() => setHeartLost(false), 2000);
            }
            setGame(prev =>
                prev
                    ? {
                          ...prev,
                          defeatedCurBoss: data.type === "PASS",
                          lives: data.type === "FAIL" ? prev.lives - 1 : prev.lives,
                          curLevelAttempts: data.type === "FAIL" ? prev.curLevelAttempts + 1 : prev.curLevelAttempts,
                          status: data.type === "FAIL" && prev.lives <= 1 ? "GAME_OVER" : prev.status,
                      }
                    : null,
            );
            socket.current?.off(`${jobId}-progress`);
            socket.current?.off(`${jobId}-result`);
        });
    };

    const GameErrorToast = () => {
        if (!error || showErrorModal) return null;

        return (
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
        );
    };

    const GameErrorModal = () => {
        if (!showErrorModal) return null;

        return (
            <ErrorModal
                error={error}
                errorType={errorType}
                onClose={() => {
                    setShowErrorModal(false);
                    setError("");
                }}
                onRetry={continueGame}
            />
        );
    };

    const HeartLostNotification = () => {
        if (!heartLost) return null;

        return (
            <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-300">
                <div className="px-6 py-4 bg-red-500/20 border border-red-500/30 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-4">
                    <div className="relative">
                        <Heart size={32} className="text-red-500 fill-red-500 animate-pulse" />
                        <div className="absolute -top-1 -right-1">
                            <Skull size={16} className="text-red-400" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-red-400 tracking-wider">LIFE LOST</span>
                        <span className="text-xs text-red-400/70">
                            {game?.lives || 0} {(game?.lives || 0) === 1 ? "life" : "lives"} remaining
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const getRaceIcon = (race: string) => {
        switch (race) {
            case "elf":
                return <Sparkles size={20} className="text-purple-400" />;
            case "human":
                return <User size={20} className="text-blue-400" />;
            case "dwarf":
                return <Shield size={20} className="text-amber-400" />;
            default:
                return <User size={20} />;
        }
    };

    const GameTopBar = () => (
        <div className="h-10 border-b border-border flex items-center justify-between px-4 select-none z-50 bg-background shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/menu")}
                    className="font-bold tracking-wider text-lg text-accent hover:opacity-80 transition-opacity cursor-pointer"
                >
                    <GlitchText text="ALOFY" className="text-lg" />
                </button>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 text-xs text-foreground/70">
                    <Gamepad2 size={14} className="text-accent" />
                    <span className="font-bold tracking-wider">LEVEL {game?.curLevel || 0}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>SYSTEM ONLINE</span>
                </div>
            </div>

            <div className="flex items-center gap-5 text-xs">
                <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border">
                    <Trophy size={12} className="text-yellow-400" />
                    <span className="font-bold">{game?.point || 0} PTS</span>
                </div>
                <div className="flex items-center gap-1 bg-card px-3 py-1 rounded-full border border-border">
                    {[...Array(3)].map((_, i) => (
                        <Heart
                            key={i}
                            size={14}
                            className={`${i < (game?.lives || 0) ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border">
                    <Activity size={12} className="text-accent" />
                    <span>CPU 12%</span>
                </div>
                <div className="flex items-center gap-4">
                    <Signal size={14} />
                    <Wifi size={14} className="text-blue-500" />
                    <div className="flex items-center gap-1">
                        <span>100%</span>
                        <Battery size={14} className="fill-green-500" />
                    </div>
                    <span className="font-bold ml-2">{currentTime}</span>
                </div>
                {/* User Avatar */}
                <div className="h-4 w-px bg-border" />
                <button
                    onClick={() => router.push("/profile")}
                    className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden hover:border-accent/50 transition-colors cursor-pointer"
                >
                    {authLoading ? (
                        <div className="w-full h-full bg-card animate-pulse" />
                    ) : authUser?.profile?.avatarUrl ? (
                        <img
                            src={authUser.profile.avatarUrl}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <UserCircle size={18} className="text-accent/50" />
                    )}
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-4">
                    <Cpu className="animate-pulse w-12 h-12 text-accent" />
                    <span className="text-sm tracking-widest text-foreground/70">LOADING GAME...</span>
                </div>
            </div>
        );
    }

    // Level 0: Start Game Screen
    if (game && game.curLevel === 0) {
        return (
            <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
                <GameTopBar />
                <GameErrorToast />
                <GameErrorModal />

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TitleBar title="start_game.exe" />

                        <div className="p-8 flex flex-col items-center gap-6">
                            <div className="p-4 bg-accent/10 rounded-full border border-accent/20">
                                <Gamepad2 size={48} className="text-accent" />
                            </div>

                            <div className="text-center">
                                <h2 className="text-xl font-bold tracking-wide text-foreground mb-2">
                                    READY TO BEGIN?
                                </h2>
                                <p className="text-xs text-foreground/50 uppercase tracking-widest">
                                    Your adventure awaits, {character?.name || "Hero"}
                                </p>
                            </div>

                            <button
                                onClick={continueGame}
                                disabled={starting}
                                className="w-full px-6 py-4 bg-accent/10 text-accent text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-accent/20 transition-all duration-200 border border-accent/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {starting ? (
                                    <>
                                        <Cpu className="animate-spin" size={20} />
                                        <span>INITIALIZING...</span>
                                    </>
                                ) : (
                                    <>
                                        <CirclePlay size={20} />
                                        <span>START GAME</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Game Over
    if (game && game.status === "GAME_OVER") {
        return (
            <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
                <GameErrorToast />
                <GameErrorModal />

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
                        {/* Big GAME OVER Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-6xl font-black tracking-widest text-red-500 mb-2 animate-pulse">
                                GAME OVER
                            </h1>
                            <div className="h-1 w-32 mx-auto bg-linear-to-r from-transparent via-red-500 to-transparent" />
                        </div>

                        {/* Stats Card */}
                        <div className="bg-card rounded-xl border border-red-500/30 shadow-2xl overflow-hidden">
                            <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                    <Skull size={24} className="text-red-500" />
                                    <span className="text-sm font-bold text-red-400 tracking-widest uppercase">
                                        Final Statistics
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Character Info */}
                                {character && (
                                    <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border">
                                        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                                            {getRaceIcon(character.race)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground tracking-wide">
                                                {character.name}
                                            </h3>
                                            <p className="text-xs text-foreground/50 capitalize">
                                                {character.race} · {character.gender} · Age {character.age}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-background/50 rounded-lg border border-border text-center">
                                        <Gamepad2 size={24} className="mx-auto mb-2 text-accent" />
                                        <p className="text-2xl font-bold text-foreground">{game.curLevel}</p>
                                        <p className="text-xs text-foreground/50 uppercase tracking-wider">
                                            Levels Reached
                                        </p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-lg border border-border text-center">
                                        <Trophy size={24} className="mx-auto mb-2 text-yellow-400" />
                                        <p className="text-2xl font-bold text-foreground">{game.point}</p>
                                        <p className="text-xs text-foreground/50 uppercase tracking-wider">
                                            Points Scored
                                        </p>
                                    </div>
                                </div>

                                {/* Hearts Lost */}
                                <div className="flex justify-center gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <Heart key={i} size={24} className="text-gray-600" />
                                    ))}
                                </div>

                                {/* Back to Menu Button */}
                                <button
                                    onClick={() => router.push("/menu")}
                                    className="w-full mt-4 px-6 py-4 bg-card text-foreground text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-950 transition-all duration-200 border border-border flex items-center justify-center gap-3"
                                >
                                    <Home size={20} />
                                    <span>Back to Main Menu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Game Ended (Victory)
    if (game && game.status === "ENDED") {
        return (
            <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
                <GameErrorToast />
                <GameErrorModal />

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
                        {/* Big Congratulations Text */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <Trophy size={64} className="text-yellow-400 animate-bounce" />
                            </div>
                            <h1 className="text-5xl font-black tracking-widest text-green-400 mb-2">VICTORY!</h1>
                            <p className="text-lg text-foreground/70 tracking-wide">🎉 Congratulations, Champion! 🎉</p>
                            <div className="h-1 w-48 mx-auto mt-4 bg-linear-to-r from-transparent via-green-500 to-transparent" />
                        </div>

                        {/* Stats Card */}
                        <div className="bg-card rounded-xl border border-green-500/30 shadow-2xl overflow-hidden">
                            <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                    <Sparkles size={24} className="text-green-400" />
                                    <span className="text-sm font-bold text-green-400 tracking-widest uppercase">
                                        Final Statistics
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Character Info */}
                                {character && (
                                    <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-green-500/20">
                                        <div className="w-12 h-12 rounded-full bg-card border border-green-500/30 flex items-center justify-center">
                                            {getRaceIcon(character.race)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground tracking-wide">
                                                {character.name}
                                            </h3>
                                            <p className="text-xs text-foreground/50 capitalize">
                                                {character.race} · {character.gender} · Age {character.age}
                                            </p>
                                        </div>
                                        <div className="ml-auto px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                            <span className="text-xs font-bold text-green-400 uppercase">Hero</span>
                                        </div>
                                    </div>
                                )}

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-background/50 rounded-lg border border-border text-center">
                                        <Gamepad2 size={24} className="mx-auto mb-2 text-accent" />
                                        <p className="text-2xl font-bold text-foreground">10</p>
                                        <p className="text-xs text-foreground/50 uppercase tracking-wider">Levels</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-lg border border-border text-center">
                                        <Trophy size={24} className="mx-auto mb-2 text-yellow-400" />
                                        <p className="text-2xl font-bold text-foreground">{game.point}</p>
                                        <p className="text-xs text-foreground/50 uppercase tracking-wider">Points</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-lg border border-border text-center">
                                        <Heart size={24} className="mx-auto mb-2 text-red-500 fill-red-500" />
                                        <p className="text-2xl font-bold text-foreground">{game.lives}</p>
                                        <p className="text-xs text-foreground/50 uppercase tracking-wider">
                                            Lives Left
                                        </p>
                                    </div>
                                </div>

                                {/* Hearts Display */}
                                <div className="flex justify-center gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <Heart
                                            key={i}
                                            size={24}
                                            className={`${
                                                i < game.lives ? "text-red-500 fill-red-500" : "text-gray-600"
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Back to Menu Button */}
                                <button
                                    onClick={() => router.push("/menu")}
                                    className="w-full mt-4 px-6 py-4 bg-green-500/10 text-green-400 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-green-500/20 transition-all duration-200 border border-green-500/30 flex items-center justify-center gap-3"
                                >
                                    <Home size={20} />
                                    <span>Back to Main Menu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Level divisible by 3 (but not 0): Story + Editor
    if (game && game.curLevel % 3 === 0) {
        return (
            <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
                <GameTopBar />
                <GameErrorToast />
                <GameErrorModal />
                <HeartLostNotification />

                <div ref={containerRef} className="flex-1 flex p-2 gap-2 relative overflow-hidden">
                    {/* Story Panel */}
                    <div
                        style={{ width: `${leftPanelWidth}%` }}
                        className="flex flex-col bg-card rounded-lg border border-border shadow-xl overflow-hidden"
                    >
                        <TitleBar title="challenge.txt" />

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            <div className="whitespace-pre-wrap leading-relaxed text-sm opacity-90">
                                {game.curLevelStory}
                            </div>
                        </div>
                    </div>

                    {/* Resize Handle */}
                    <div
                        onMouseDown={handleMouseDown}
                        className={`w-1 cursor-col-resize hover:bg-accent transition-colors rounded-full flex items-center justify-center z-40 ${
                            isDragging ? "bg-accent" : "bg-transparent"
                        }`}
                    >
                        <div className="w-0.5 h-8 bg-border" />
                    </div>

                    {/* Editor Panel */}
                    <div
                        ref={editorPanelRef}
                        className="flex-1 flex flex-col bg-card rounded-lg border border-border shadow-xl overflow-hidden min-w-75"
                    >
                        <TitleBar title="solution" />

                        <div className="relative flex-1 min-h-0 z-0">
                            <Editor
                                height="100%"
                                language={getMonacoLanguage(language)}
                                theme="alofy-dark"
                                value={userCode}
                                onChange={v => setUserCode(v as string)}
                                beforeMount={handleEditorWillMount}
                                options={{
                                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    lineNumbers: "on",
                                    renderLineHighlight: "line",
                                    padding: { top: 16, bottom: 16 },
                                    cursorBlinking: "smooth",
                                    smoothScrolling: true,
                                    contextmenu: true,
                                    mouseWheelZoom: true,
                                    wordWrap: "on",
                                }}
                            />
                        </div>

                        {/* Bottom Resize Handle */}
                        <div
                            onMouseDown={handleBottomResizeMouseDown}
                            className={`h-1.5 cursor-row-resize hover:bg-accent transition-colors flex items-center justify-center shrink-0 ${
                                isResizingBottom ? "bg-accent" : "bg-transparent"
                            }`}
                        >
                            <div className="w-12 h-0.5 bg-border rounded-full" />
                        </div>

                        {/* Bottom Bar */}
                        <div
                            style={{ height: `${bottomBarHeight}px` }}
                            className="shrink-0 border-t border-border bg-background flex gap-4 items-center justify-end px-6 py-4 font-mono text-sm transition-none overflow-visible relative z-10"
                        >
                            {executed ? (
                                <div className="w-full h-full flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-6 flex-1 min-w-0 h-full">
                                        {result && (
                                            <div
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase shrink-0 ${
                                                    result.type === "PASS"
                                                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                                }`}
                                            >
                                                {result.type === "PASS" ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <XCircle size={14} />
                                                )}
                                                <span>{result.type}</span>
                                            </div>
                                        )}

                                        {progress && (
                                            <div className="flex flex-col gap-1 min-w-25 shrink-0">
                                                <div className="flex justify-between text-[10px] text-foreground/60 uppercase tracking-widest">
                                                    <span>Progress</span>
                                                    <span>{Math.round((progress.passed / progress.total) * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-card rounded-full overflow-hidden border border-border">
                                                    <div
                                                        style={{
                                                            width: `${(progress.passed / progress.total) * 100}%`,
                                                        }}
                                                        className={`h-full transition-all duration-500 ease-out ${
                                                            result?.type === "FAIL" ? "bg-red-500" : "bg-green-500"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {result?.type === "FAIL" && (
                                            <div className="flex items-start gap-4 border-l border-border pl-6 ml-2 flex-1 min-w-0 h-full overflow-hidden">
                                                {result.error ? (
                                                    <div className="flex flex-col gap-1 text-red-400 w-full h-full overflow-hidden">
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <AlertCircle size={16} className="shrink-0" />
                                                            <span className="text-xs font-bold uppercase opacity-75">
                                                                Runtime Error
                                                            </span>
                                                        </div>
                                                        <pre className="text-xs font-mono opacity-90 whitespace-pre-wrap wrap-break-words overflow-y-auto flex-1 min-h-0">
                                                            {result.error}
                                                        </pre>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-3 text-xs shrink-0">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-foreground/50 uppercase shrink-0">
                                                                Expected
                                                            </span>
                                                            <code className="bg-card border border-border px-2 py-1 rounded text-green-400 whitespace-nowrap">
                                                                {result.expectedOutput?.trim() || "N/A"}
                                                            </code>
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-foreground/50 uppercase shrink-0">
                                                                Actual
                                                            </span>
                                                            <code className="bg-card border border-border px-2 py-1 rounded text-red-400 whitespace-nowrap">
                                                                {result.yourOutput?.trim() || "N/A"}
                                                            </code>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {result?.type === "PASS" ? (
                                        <button
                                            onClick={continueGame}
                                            disabled={starting}
                                            className="px-5 py-3 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-green-500/20 transition-all duration-200 overflow-hidden flex items-center gap-2 border border-green-500/30 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {starting ? (
                                                <>
                                                    <Cpu className="animate-spin" size={20} />
                                                    <span>LOADING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronRight size={20} />
                                                    <span>Continue</span>
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setExecuted(false);
                                                setProgress(null);
                                                setResult(null);
                                            }}
                                            className="px-5 py-3 bg-card text-foreground text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-indigo-950 transition-all duration-200 overflow-hidden flex items-center gap-2 border border-border shrink-0"
                                        >
                                            <CirclePlay size={20} className="rotate-180" />
                                            Try Again
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                                        <span className="px-3 py-1.5 bg-card border border-border rounded-lg font-bold">
                                            {getLanguageDisplayName(language)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={execute}
                                        className="px-5 py-3 bg-card text-foreground text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-indigo-950 transition-all duration-200 overflow-hidden flex items-center gap-2 border border-border"
                                    >
                                        <CirclePlay size={20} />
                                        Execute
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Level NOT divisible by 3: Story only with Next button
    return (
        <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
            <GameTopBar />
            <GameErrorToast />
            <GameErrorModal />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TitleBar title="story.txt" />

                    <div className="p-6 min-h-80 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm opacity-90">
                            {game?.curLevelStory}
                        </div>
                    </div>

                    <div className="border-t border-border p-4 flex justify-end">
                        <button
                            onClick={continueGame}
                            disabled={starting}
                            className="px-6 py-3 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-accent/20 transition-all duration-200 border border-accent/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {starting ? (
                                <>
                                    <Cpu className="animate-spin" size={16} />
                                    <span>LOADING...</span>
                                </>
                            ) : (
                                <>
                                    <span>CONTINUE</span>
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
