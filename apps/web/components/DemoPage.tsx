"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../utils/client-api";
import { AxiosError } from "axios";
import Editor, { Monaco } from "@monaco-editor/react";
import { Maximize2, Minus, X, Cpu, CirclePlay, AlertCircle, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import TopBar from "./TopBar";
import { Progress, Result } from "@repo/types";
import { io, Socket } from "socket.io-client";

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

export default function DemoPageComponent() {
    const [story, setStory] = useState<string>("");
    const [progress, setProgress] = useState<Progress | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [executed, setExecuted] = useState<boolean>(false);
    const [userCode, setUserCode] = useState<string>("");
    const [starterCode, setStarterCode] = useState<StarterCode | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [leftPanelWidth, setLeftPanelWidth] = useState(48);
    const [isDragging, setIsDragging] = useState(false);
    const [bottomBarHeight, setBottomBarHeight] = useState(100);
    const [isResizingBottom, setIsResizingBottom] = useState(false);
    const [language, setLanguage] = useState<Python | Java | Cpp>({
        name: "python",
        version: "3.x",
    });
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

    const handleLanguageChange = (newLanguage: Python | Java | Cpp) => {
        setLanguage(newLanguage);
        if (starterCode) {
            setUserCode(starterCode[newLanguage.name]);
        }
    };

    const languageOptions: (Python | Java | Cpp)[] = [
        { name: "python", version: "3.x" },
        { name: "java", version: "15.x" },
        { name: "cpp", version: "10.x" },
    ];

    const getLanguageDisplayName = (lang: Python | Java | Cpp) => {
        switch (lang.name) {
            case "python":
                return "Python3";
            case "java":
                return "Java";
            case "cpp":
                return "C++";
        }
    };

    const getMonacoLanguage = (lang: Python | Java | Cpp) => {
        switch (lang.name) {
            case "python":
                return "python";
            case "java":
                return "java";
            case "cpp":
                return "cpp";
        }
    };
    const socket = useRef<Socket | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const editorPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.current = io();

        const fetchDemoStory = async () => {
            setLoading(true);
            try {
                const response = await api.get("/game/demo");
                setStory(response.data.story);
                setStarterCode(response.data.starterCode);
                setUserCode(response.data.starterCode.python);
            } catch (er) {
                if (er instanceof AxiosError) console.log(er.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDemoStory();

        return () => {
            socket.current?.disconnect();
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleBottomResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingBottom(true);
    };

    const execute = async () => {
        if (!socket.current) return;
        setExecuted(true);

        const socketId = socket.current.id;
        const data = {
            socketId,
            problemSlug: "two-sum",
            userCode,
            language: language.name,
            version: language.version,
        };

        const res = await api.post("/execute/demo", data);
        const jobId = res.data;
        console.log(jobId);

        socket.current.on(`${jobId}-progress`, data => setProgress(data));
        socket.current.on(`${jobId}-result`, data => {
            setResult(data);
            console.log(data);
            socket.current?.off(`${jobId}-progress`);
            socket.current?.off(`${jobId}-result`);
        });
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-4">
                    <Cpu className="animate-pulse w-12 h-12 text-accent" />
                    <span className="text-sm tracking-widest">INITIALIZING SEQUENCE...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden font-mono selection:bg-accent selection:text-background">
            <TopBar />

            <div ref={containerRef} className="flex-1 flex p-2 gap-2 relative overflow-hidden">
                <div
                    style={{ width: `${leftPanelWidth}%` }}
                    className="flex flex-col bg-card rounded-lg border border-border shadow-xl overflow-hidden"
                >
                    <TitleBar title="story.txt" />

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm opacity-90">{story}</div>
                    </div>
                </div>

                <div
                    onMouseDown={handleMouseDown}
                    className={`w-1 cursor-col-resize hover:bg-accent transition-colors rounded-full flex items-center justify-center z-40 ${isDragging ? "bg-accent" : "bg-transparent"}`}
                >
                    <div className="w-0.5 h-8 bg-border" />
                </div>

                <div
                    ref={editorPanelRef}
                    className="flex-1 flex flex-col bg-card rounded-lg border border-border shadow-xl overflow-hidden min-w-75"
                >
                    <TitleBar title="main" />

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

                    <div
                        onMouseDown={handleBottomResizeMouseDown}
                        className={`h-1.5 cursor-row-resize hover:bg-accent transition-colors flex items-center justify-center shrink-0 ${isResizingBottom ? "bg-accent" : "bg-transparent"}`}
                    >
                        <div className="w-12 h-0.5 bg-border rounded-full" />
                    </div>

                    <div
                        style={{ height: `${bottomBarHeight}px` }}
                        className="shrink-0 border-t border-border bg-background flex gap-4 items-center justify-end px-6 py-4 font-mono text-sm transition-none overflow-visible relative z-10"
                    >
                        {executed ? (
                            <div className="w-full h-full flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-6 flex-1 min-w-0 h-full">
                                    {result && (
                                        <div
                                            className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase shrink-0
                          ${
                              result.type === "PASS"
                                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                          }
                        `}
                                        >
                                            {result.type === "PASS" ? <CheckCircle size={14} /> : <XCircle size={14} />}
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
                                                    className={`h-full transition-all duration-500 ease-out ${result?.type === "FAIL" ? "bg-red-500" : "bg-green-500"}`}
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
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-between gap-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                        className="px-4 py-3 bg-card text-foreground text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-indigo-950 transition-all duration-200 flex items-center gap-2 border border-border"
                                    >
                                        <span>{getLanguageDisplayName(language)}</span>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${languageDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    {languageDropdownOpen && (
                                        <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 min-w-35">
                                            {languageOptions.map(option => (
                                                <button
                                                    key={option.name}
                                                    onClick={() => {
                                                        handleLanguageChange(option);
                                                        setLanguageDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-left hover:bg-indigo-950 transition-colors ${
                                                        language.name === option.name
                                                            ? "bg-indigo-950/50 text-accent"
                                                            : "text-foreground"
                                                    }`}
                                                >
                                                    {getLanguageDisplayName(option)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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
