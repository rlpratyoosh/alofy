import api from "@/libs/axios";
import { Profile } from "@repo/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type User = {
    userId: string;
    username: string;
    email: string;
    userType: string;
    profileId: string | null;
    profile: Profile;
};

const useAuth = () => {
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch (err: any) {
                if (err instanceof AxiosError) setError(err.response?.data?.message || "An error occurred");
                else setError("An unknown error occurred while fetching user");
                setUser(undefined);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Logout failed");
        }
    };

    const logoutAll = async () => {
        try {
            await api.post("/auth/logoutall");
            router.push("/login");
        } catch (err: any) {
            if (err instanceof AxiosError) setError(err.response?.data?.message || "Logout Failed");
            else setError("An unknown error occurred while trying to logout");
        }
    };

    return { user, loading, error, logout, logoutAll };
};

export default useAuth;
