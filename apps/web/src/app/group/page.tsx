"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Group } from "@repo/types";
import api from "@/libs/axios";
import { AxiosError } from "axios";

interface GroupWPCount extends Group {
    _count: {
        profiles: number;
    };
}

export default function GroupPage() {
    const [groups, setGroups] = useState<GroupWPCount[]>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter()
    
    useEffect(() => {
        const getAllGroups = async () => {
            setLoading(true);
            try {
                const res = await api.get("/group");
                const result = res.data;
                console.log(result);
                setGroups(result);
            } catch (err) {
                if (err instanceof AxiosError)
                    setError(err.response?.data?.message || "Fetching Groups Failed");
                else
                    setError("An unknown error occurred while fetching groups")
            } finally {
                setLoading(false);
            }
        };
        getAllGroups();
    }, []);

    const handleClick = (slug: string) => {
        router.push(`/group/${slug}`)
    }

    return (
        <>
            {groups?.map(group => (
                <div key={group.id} className="">
                    {group.name} : {group.description} <br />
                    <button onClick={() => handleClick(group.slug)}>Click to open group</button>
                </div>
            ))}
        </>
    );
}
