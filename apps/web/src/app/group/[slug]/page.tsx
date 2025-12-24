"use client";

import { useParams } from "next/navigation";

export default function EachGroupPage() {
    const { slug } = useParams<{ slug: string }>();
    return <>{slug}</>;
}
