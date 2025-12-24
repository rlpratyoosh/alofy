import api from "@/libs/axios";
import { Profile } from "@repo/types";
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
                setError(err.response?.data?.message || "An error occurred");
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

    return { user, loading, error, logout };
};

export default useAuth;
