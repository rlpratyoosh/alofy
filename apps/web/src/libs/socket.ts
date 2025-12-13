import { io } from "socket.io-client";
import api from "./axios";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", {
    withCredentials: true,
    autoConnect: false,
});

let isRefreshing = false;

socket.on("connect_error", async err => {
    if (err.message === "Unauthorized") {
        console.log("Socket Auth failed. Attempting refresh...");

        if (isRefreshing) return; // Don't spam refresh
        isRefreshing = true;

        try {
            await api.post("/auth/refresh");

            console.log("Refresh success. Retrying socket connection...");
            isRefreshing = false;

            socket.connect();
        } catch (refreshError) {
            console.error("Socket refresh failed. Redirecting to login.");
            isRefreshing = false;
        }
    }
});

export default socket;
