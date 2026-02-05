"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserDto, RegisterUserSchema } from "@repo/schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "../utils/client-api";
import { AxiosError } from "axios";
import {
  Maximize2,
  Minus,
  X,
  UserPlus,
  ArrowLeft,
  Cpu,
  KeyRound,
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

export default function RegisterForm() {
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [sentOtp, setSentOtp] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserDto>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterUserDto) => {
    setUsername(data.username);
    setPassword(data.password);
    setError("");
    try {
      await api.post("/auth/register", data);
      setSentOtp(true);
    } catch (err) {
      if (err instanceof AxiosError)
        setError(err.response?.data.message as string);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");
    try {
      await api.post("/auth/login", {
        username,
        password,
        otp,
      });
      router.push("/menu");
    } catch (err) {
      if (err instanceof AxiosError)
        setError(err.response?.data.message as string);
    } finally {
      setOtpLoading(false);
    }
  };

  if (sentOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 font-mono">
        <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TitleBar title="verify_otp.exe" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <KeyRound size={20} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide text-foreground">
                  VERIFY OTP
                </h2>
                <p className="text-xs text-foreground/50 uppercase tracking-widest">
                  Check your email for the code
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

            <form onSubmit={onOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold tracking-wide hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <Cpu className="animate-spin" size={16} />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <span>VERIFY & LOGIN</span>
                )}
              </button>
            </form>

            {/* Back to Register */}
            <button
              onClick={() => {
                setSentOtp(false);
                setOtp("");
                setError("");
              }}
              className="w-full mt-4 py-2 text-xs text-foreground/50 hover:text-foreground/70 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Back to registration</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 font-mono">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TitleBar title="register.exe" onClose={() => router.push("/menu")} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <UserPlus size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-foreground">
                CREATE ACCOUNT
              </h2>
              <p className="text-xs text-foreground/50 uppercase tracking-widest">
                Join the adventure
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                {...register("username")}
                placeholder="e.g. hippo"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="e.g. hippo@mail.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold tracking-wide hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="animate-spin" size={16} />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <span>REGISTER</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Already have account */}
          <div className="text-center">
            <p className="text-xs text-foreground/50 mb-2">
              Already have an account?
            </p>
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-accent hover:text-accent/80 font-bold tracking-wide transition-colors"
            >
              LOGIN HERE
            </button>
          </div>

          {/* Back to Menu */}
          <button
            onClick={() => router.push("/menu")}
            className="w-full mt-4 py-2 text-xs text-foreground/50 hover:text-foreground/70 transition-colors flex items-center justify-center gap-2 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
