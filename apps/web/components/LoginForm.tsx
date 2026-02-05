"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserDto, LoginUserSchema } from "@repo/schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "../utils/client-api";
import { AxiosError } from "axios";
import {
  Maximize2,
  Minus,
  X,
  LogIn,
  ArrowLeft,
  UserPlus,
  KeyRound,
  User,
  Cpu,
  AlertCircle,
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

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginUserDto) => {
    setUsername(data.username);
    setPassword(data.password);
    setError("");
    try {
      await api.post("/auth/sendotp", data);
      setOtpSent(true);
    } catch (err) {
      if (err instanceof AxiosError) setError(err.response?.data.message);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpLoading(true);
    try {
      await api.post("/auth/login", {
        username,
        password,
        otp,
      });
      router.push("/menu");
    } catch (err) {
      if (err instanceof AxiosError) setError(err.response?.data.message);
    } finally {
      setOtpLoading(false);
    }
  };

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 font-mono">
        <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TitleBar title="verify_otp.exe" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <KeyRound size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide text-foreground">
                  VERIFY OTP
                </h2>
                <p className="text-xs text-foreground/50 uppercase tracking-widest">
                  Enter the code sent to your email
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

            <form onSubmit={onOtpSubmit} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
                  />
                  <input
                    type="text"
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3 bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-all duration-200 text-accent font-bold tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <Cpu className="animate-pulse w-4 h-4" />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>VERIFY & LOGIN</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* Back Button */}
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError("");
              }}
              className="w-full py-2.5 bg-background border border-border rounded-lg hover:bg-card transition-all duration-200 text-foreground/50 hover:text-foreground/70 font-bold tracking-wide text-xs flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>GO BACK</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 font-mono">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TitleBar title="login.exe" onClose={() => router.push("/menu")} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <LogIn size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-foreground">
                LOGIN
              </h2>
              <p className="text-xs text-foreground/50 uppercase tracking-widest">
                Access your account
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
                />
                <input
                  {...register("username")}
                  placeholder="e.g. hippo"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
                />
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-200 text-green-400 font-bold tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="animate-pulse w-4 h-4" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>LOG IN</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Register Link */}
          <button
            onClick={() => router.push("/register")}
            className="w-full p-3 bg-background border border-border rounded-lg hover:bg-card transition-all duration-200 text-left group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-card border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
              <UserPlus size={14} className="text-purple-400" />
            </div>
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider group-hover:text-purple-400 transition-colors">
              No account? Register here
            </span>
          </button>

          {/* Back to Menu */}
          <button
            onClick={() => router.push("/menu")}
            className="w-full mt-3 py-2.5 bg-background border border-border rounded-lg hover:bg-card transition-all duration-200 text-foreground/50 hover:text-foreground/70 font-bold tracking-wide text-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>BACK TO MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
}
