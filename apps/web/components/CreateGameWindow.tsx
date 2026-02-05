"use client";

import { Character } from "@repo/db";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { api } from "../utils/client-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCharacterDto, CreateCharacterSchema } from "@repo/schema";
import { useRouter } from "next/navigation";
import {
  Maximize2,
  Minus,
  X,
  Cpu,
  Plus,
  User,
  ArrowLeft,
  Gamepad2,
  CheckCircle,
  AlertCircle,
  Sword,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import TopBar from "./TopBar";

const TitleBar = ({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) => (
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
    <div className="w-12 flex justify-end">
      {onBack && (
        <button
          onClick={onBack}
          className="p-1 hover:bg-card rounded transition-colors"
        >
          <ArrowLeft size={14} className="text-gray-400" />
        </button>
      )}
    </div>
  </div>
);

const getRaceIcon = (race: string) => {
  switch (race) {
    case "elf":
      return <Sparkles size={14} className="text-purple-400" />;
    case "human":
      return <User size={14} className="text-blue-400" />;
    case "dwarf":
      return <Shield size={14} className="text-amber-400" />;
    default:
      return <User size={14} />;
  }
};

const getClassIcon = (cls: string) => {
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

export default function CreateGameWindow() {
  const [openCCWindow, setOpenCCWindow] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [loadingCharacter, setLoadingCharacter] = useState<boolean>(true);
  const [refetchCharacters, setRefetchCharacters] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [creatingGame, setCreatingGame] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCharacterDto>({
    resolver: zodResolver(CreateCharacterSchema),
  });

  useEffect(() => {
    const getCharacters = async () => {
      setLoadingCharacter(true);
      try {
        const response = await api.get("/character");
        setCharacters(response.data);
      } catch (er) {
        if (er instanceof AxiosError) setError(er.response?.data.message);
      } finally {
        setLoadingCharacter(false);
      }
    };

    getCharacters();
  }, [refetchCharacters]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (data: CreateCharacterDto) => {
    try {
      await api.post("/character", data);
      setRefetchCharacters(refetchCharacters + 1);
      setMessage("Created Character Successfully");
      reset();
      await Promise.resolve(
        new Promise((resolve) => setTimeout(resolve, 2000)),
      );
      setOpenCCWindow(false);
      setMessage("");
    } catch (er) {
      if (er instanceof AxiosError) setError(er.response?.data.message);
    }
  };

  const handleStartGame = async () => {
    setCreatingGame(true);
    try {
      const response = await api.post("/game", {
        characterId: selectedCharacter,
      });
      setMessage("Game Creation successful");
      await Promise.resolve(
        new Promise((resolve) => setTimeout(resolve, 2000)),
      );
      router.push(`/game/${response.data}`);
    } catch (er) {
      if (er instanceof AxiosError) setError(er.response?.data.message);
    } finally {
      setCreatingGame(false);
    }
  };

  const handleDelete = async (characterId: string) => {
    setDeleting(true);
    try {
      await api.delete(`/character/${characterId}`);
      setMessage("Deleted Successfully!");
      setRefetchCharacters(refetchCharacters + 1);
      await Promise.resolve(
        new Promise((resolve) => setTimeout(resolve, 2000)),
      );
      setMessage("");
    } catch (er) {
      if (er instanceof AxiosError) setError(er.response?.data.message);
    } finally {
      setDeleting(false);
    }
  };

  const selectedCharacterData = characters.find(
    (c) => c.id === selectedCharacter,
  );

  // Loading State
  if (loadingCharacter) {
    return (
      <div className="flex flex-col h-screen overflow-hidden font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <Cpu className="animate-pulse w-12 h-12 text-accent" />
            <span className="text-sm tracking-widest text-foreground/70">
              LOADING CHARACTERS...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Character Selection Screen
  if (!selectedCharacter && !openCCWindow) {
    return (
      <div className="flex flex-col h-screen overflow-hidden font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-2xl bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TitleBar title="select_character" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                  <User size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-foreground">
                    SELECT CHARACTER
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest">
                    Choose your hero to begin the adventure
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {message && (
                <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle size={16} className="text-green-400 shrink-0" />
                  <span className="text-xs text-green-400">{message}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              {/* Character List */}
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-2">
                {characters.length === 0 ? (
                  <div className="text-center py-8 text-foreground/50 text-sm">
                    <User size={32} className="mx-auto mb-3 opacity-50" />
                    <p>No characters found</p>
                    <p className="text-xs mt-1">
                      Create your first character to begin
                    </p>
                  </div>
                ) : (
                  characters.map((character) => (
                    <div
                      key={character.id}
                      className="w-full p-4 bg-background border border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 text-left group flex items-center gap-3"
                    >
                      <button
                        onClick={() => setSelectedCharacter(character.id)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
                              {getRaceIcon(character.race)}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground tracking-wide">
                                {character.name}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-foreground/50 mt-0.5">
                                <span className="capitalize">
                                  {character.race}
                                </span>
                                <span>•</span>
                                <span className="capitalize">
                                  {character.gender}
                                </span>
                                <span>•</span>
                                <span>Age {character.age}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-card border border-border rounded-full text-xs font-bold tracking-wider text-accent">
                              {getClassIcon(character.class)}
                            </span>
                            <Sword
                              size={16}
                              className="text-foreground/30 group-hover:text-accent transition-colors"
                            />
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(character.id);
                        }}
                        disabled={deleting}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        title="Delete character"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Create New Button */}
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setOpenCCWindow(true)}
                  className="w-full px-5 py-3 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-accent/20 transition-all duration-200 flex items-center justify-center gap-2 border border-accent/20"
                >
                  <Plus size={16} />
                  Create New Character
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Character Form
  if (openCCWindow) {
    return (
      <div className="flex flex-col h-screen overflow-hidden font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-lg bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TitleBar
              title="create_character.exe"
              onBack={() => {
                setOpenCCWindow(false);
                setMessage("");
                setError("");
                reset();
              }}
            />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Plus size={20} className="text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-foreground">
                    CREATE CHARACTER
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest">
                    Define your hero&apos;s attributes
                  </p>
                </div>
              </div>

              {/* Messages */}
              {message && (
                <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle size={16} className="text-green-400 shrink-0" />
                  <span className="text-xs text-green-400">{message}</span>
                </div>
              )}

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1.5 block">
                    Character Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Enter name..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Age Input */}
                <div>
                  <label className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1.5 block">
                    Age
                  </label>
                  <input
                    {...register("age", { valueAsNumber: true })}
                    placeholder="Enter age..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  {errors.age && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.age.message}
                    </p>
                  )}
                </div>

                {/* Race Select */}
                <div>
                  <label className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1.5 block">
                    Race
                  </label>
                  <select
                    {...register("race")}
                    defaultValue=""
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Race
                    </option>
                    <option value="elf">Elf</option>
                    <option value="human">Human</option>
                    <option value="dwarf">Dwarf</option>
                  </select>
                  {errors.race && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.race.message}
                    </p>
                  )}
                </div>

                {/* Gender Select */}
                <div>
                  <label className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1.5 block">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    defaultValue=""
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Class Select */}
                <div>
                  <label className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1.5 block">
                    Programming Class
                  </label>
                  <select
                    {...register("class")}
                    defaultValue=""
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                  {errors.class && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.class.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-5 py-3 bg-card text-foreground text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-950 transition-all duration-200 flex items-center justify-center gap-2 border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Cpu size={16} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Create Character
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Creation Screen (Character Selected)
  if (selectedCharacter && selectedCharacterData) {
    return (
      <div className="flex flex-col h-screen overflow-hidden font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-lg bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TitleBar
              title="start_game.exe"
              onBack={() => {
                setSelectedCharacter("");
                setMessage("");
                setError("");
              }}
            />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                  <Gamepad2 size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-foreground">
                    START ADVENTURE
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest">
                    Ready to begin your journey?
                  </p>
                </div>
              </div>

              {/* Messages */}
              {message && (
                <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle size={16} className="text-green-400 shrink-0" />
                  <span className="text-xs text-green-400">{message}</span>
                </div>
              )}

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              {/* Selected Character Card */}
              <div className="p-4 bg-background border border-border rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-card border border-accent/30 flex items-center justify-center">
                    {getRaceIcon(selectedCharacterData.race)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground tracking-wide text-lg">
                      {selectedCharacterData.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-foreground/50 mt-1">
                      <span className="capitalize">
                        {selectedCharacterData.race}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        {selectedCharacterData.gender}
                      </span>
                      <span>•</span>
                      <span>Age {selectedCharacterData.age}</span>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 bg-card border border-accent/30 rounded-full text-xs font-bold tracking-wider text-accent">
                    {getClassIcon(selectedCharacterData.class)}
                  </span>
                </div>
              </div>

              {/* Start Game Button */}
              <button
                onClick={handleStartGame}
                disabled={creatingGame}
                className="w-full px-5 py-4 bg-accent/10 text-accent text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-accent/20 transition-all duration-200 flex items-center justify-center gap-3 border border-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingGame ? (
                  <>
                    <Cpu size={20} className="animate-spin" />
                    Initializing Game...
                  </>
                ) : (
                  <>
                    <Gamepad2 size={20} />
                    Start Adventure
                  </>
                )}
              </button>

              {/* Back to Selection */}
              <button
                onClick={() => setSelectedCharacter("")}
                className="w-full mt-3 px-5 py-3 text-foreground/50 text-xs font-bold uppercase tracking-wider rounded-xl hover:text-foreground hover:bg-card transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} />
                Choose Different Character
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
