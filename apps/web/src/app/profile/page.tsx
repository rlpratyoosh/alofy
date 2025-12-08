"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) setError(result.message);
            else {
                setUsername(result.username);
                setEmail(result.email);
                setLoading(false);
            }
        };

        getUser();
    }, []);

    return (
        <div className="flex flex-col items-start justify-center">
            {error && <div className="text-red-400">{error}</div>}
            Welcome, {username} <br />
            Your Email is: {email}
        </div>
    );
}
