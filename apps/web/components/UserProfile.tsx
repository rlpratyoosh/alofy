"use client";

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { UpdateProfileDto, UpdateProfileSchema } from "@repo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../utils/client-api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import TopBar from "./TopBar";
import {
  Maximize2,
  Minus,
  X,
  UserCircle,
  Edit3,
  ArrowLeft,
  LogOut,
  Cpu,
  AlertCircle,
  Mail,
  User,
  FileText,
  Image as ImageIcon,
  Save,
  ChevronRight,
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

export default function UserProfile() {
  const { user, loading, signOut, error, refetch } = useAuth();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [signingOut, setSigningOut] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileDto>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  const onSubmit = async (data: UpdateProfileDto) => {
    setSubmitError("");
    try {
      const cleanData = {
        displayName: data.displayName || undefined,
        avatarUrl: data.avatarUrl || undefined,
        bio: data.bio || undefined,
      };

      await api.post("/profile/update", cleanData);
      await refetch();
      setEditMode(false);
    } catch (err) {
      if (err instanceof AxiosError) setSubmitError(err.response?.data.message);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  useEffect(() => {
    if (user?.profile) {
      reset({
        displayName: user.profile.displayName || "",
        avatarUrl: user.profile.avatarUrl || "",
        bio: user.profile.bio || "",
      });
    }
  }, [user, reset]);

  // Edit Mode
  if (editMode) {
    return (
      <div className="flex flex-col min-h-screen font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TitleBar
              title="edit_profile.exe"
              onClose={() => setEditMode(false)}
            />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Edit3 size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-foreground">
                    EDIT PROFILE
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest">
                    Update your information
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
                    />
                    <input
                      {...register("displayName")}
                      placeholder="e.g. Hippopotamus"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                    />
                  </div>
                  {errors.displayName && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.displayName.message}
                    </p>
                  )}
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                    Avatar URL
                  </label>
                  <div className="relative">
                    <ImageIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
                    />
                    <input
                      {...register("avatarUrl")}
                      placeholder="e.g. https://imgur.com/avatar.png"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                    />
                  </div>
                  {errors.avatarUrl && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.avatarUrl.message}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                    Bio
                  </label>
                  <div className="relative">
                    <FileText
                      size={16}
                      className="absolute left-3 top-3 text-foreground/30"
                    />
                    <textarea
                      {...register("bio")}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors resize-none"
                    />
                  </div>
                  {errors.bio && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold tracking-wide hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Cpu className="animate-spin" size={16} />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>SAVE CHANGES</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-4 border-t border-border" />

              {/* Cancel Button */}
              <button
                onClick={() => setEditMode(false)}
                className="w-full py-2.5 bg-background border border-border rounded-lg hover:bg-card transition-all duration-200 text-foreground/50 hover:text-foreground/70 font-bold tracking-wide text-xs flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} />
                <span>CANCEL</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-mono">
        <TopBar />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden">
            <TitleBar title="profile.exe" />
            <div className="p-12 flex flex-col items-center gap-4">
              <Cpu className="animate-pulse w-12 h-12 text-accent" />
              <span className="text-xs tracking-widest text-foreground/50">
                LOADING PROFILE...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Profile View
  return (
    <div className="flex flex-col min-h-screen font-mono">
      <TopBar />
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TitleBar title="profile.exe" onClose={() => router.push("/menu")} />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <UserCircle size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide text-foreground">
                  USER PROFILE
                </h2>
                <p className="text-xs text-foreground/50 uppercase tracking-widest">
                  Your account information
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {user && (
              <>
                {/* Avatar and Name Section */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-background rounded-lg border border-border">
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-accent/30 flex items-center justify-center overflow-hidden">
                    {user.profile?.avatarUrl ? (
                      <img
                        src={user.profile.avatarUrl}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle size={32} className="text-accent/50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">
                      {user.profile?.displayName || user.username}
                    </h3>
                    <p className="text-xs text-foreground/50">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-3 mb-6">
                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-card border border-blue-500/20 flex items-center justify-center">
                      <Mail size={14} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-bold">
                        Email
                      </p>
                      <p className="text-sm text-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.profile?.bio && (
                    <div className="p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={12} className="text-foreground/50" />
                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-bold">
                          Bio
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {user.profile.bio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all duration-200 text-left group flex items-center gap-3 mb-3"
                >
                  <div className="w-8 h-8 rounded-full bg-card border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                    <Edit3 size={14} className="text-purple-400" />
                  </div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                    Edit Profile
                  </span>
                  <ChevronRight
                    size={16}
                    className="ml-auto text-purple-400/30 group-hover:text-purple-400/70 transition-colors"
                  />
                </button>

                {/* Divider */}
                <div className="my-4 border-t border-border" />

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-200 text-left group flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-full bg-card border border-red-500/20 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                    {signingOut ? (
                      <Cpu className="animate-spin text-red-400" size={14} />
                    ) : (
                      <LogOut size={14} className="text-red-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider group-hover:text-red-300 transition-colors">
                    {signingOut ? "Signing Out..." : "Sign Out"}
                  </span>
                </button>
              </>
            )}

            {/* Back to Menu */}
            <button
              onClick={() => router.push("/menu")}
              className="w-full mt-4 py-2.5 bg-background border border-border rounded-lg hover:bg-card transition-all duration-200 text-foreground/50 hover:text-foreground/70 font-bold tracking-wide text-xs flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>BACK TO MAIN MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
