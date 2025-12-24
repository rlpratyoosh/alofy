"use client";

import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
    const {user, loading, error, logout, logoutAll} = useAuth()

    return (
        <div className="flex flex-col items-start justify-center">
            Welcome, {user?.username} <br />
            Your Email is: {user?.email}
            <button className="border-2 p-2" onClick={() => logout()}>Logout</button>
            <button className="border-2 p-2" onClick={() => logoutAll()}>LogoutAll</button>
        </div>
    );
}
