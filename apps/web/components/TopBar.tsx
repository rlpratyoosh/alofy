"use client";

import { useEffect, useState } from "react";
import { GlitchText } from "./GlitchTextComponent";
import { Wifi, Battery, Signal, Activity, UserCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const { user, loading } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 border-b border-border flex items-center justify-between px-4 select-none z-50 bg-background shrink-0">
      <div className="flex items-center gap-4">
        <div className="font-bold tracking-wider text-lg text-accent">
          <GlitchText text="ALOFY" className="text-lg" />
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-xs">
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
        <div className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-card animate-pulse" />
          ) : user?.profile?.avatarUrl ? (
            <img
              src={user.profile.avatarUrl}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle size={18} className="text-accent/50" />
          )}
        </div>
      </div>
    </div>
  );
}
