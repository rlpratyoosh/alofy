"use client";
import { useState } from "react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassowrd] = useState("");
    const [otpRequested, setOtpRequested] = useState(false);
    const [otp, setOTP] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                otp,
            }),
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) setError(result.message);
        else setMessage(result.message);
    };

    const requestOTP = async () => {
        setError("");
        setOTP("")

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sendotp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: "include",
        });

        const result = await response.json();

        console.log(result);

        if (!response.ok) setError(result.message);
        else {
            setMessage(result.message);
            setOtpRequested(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-w-screen min-h-screen">
            {error && <div className="text-sm p-2 text-red-400">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    value={username}
                    className="border p-2"
                    name="username"
                />
                <label htmlFor="password">Passowrd</label>
                <input
                    type="text"
                    onChange={e => setPassowrd(e.target.value)}
                    placeholder="Enter your password"
                    value={password}
                    className="border p-2"
                    name="password"
                />
                <button type="button" onClick={requestOTP} className="px-1 py-2 text-sm border-2">
                    Request OTP
                </button>
                {otpRequested && (
                    <input
                        type="text"
                        onChange={e => setOTP(e.target.value)}
                        placeholder="Enter your otp"
                        value={otp}
                        className="border p-2"
                        name="otp"
                    />
                )}

                <button type="submit" className="px-1 py-2 text-sm border-2">
                    Login
                </button>
            </form>
            {message && <div className="text-sm p-2 text-green-400">{message}</div>}
        </div>
    );
}
