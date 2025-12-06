"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export default function Home() {
    const [jobId, setJobId] = useState<string | null>(null);
    const [result, setResult] = useState("");
    const [code, setCode] = useState("");
    const [input, setInput] = useState("");
    const [isError, setIsError] = useState(false);

    const executeCode = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language: "python",
                code,
                input,
            }),
        });
        const data = await res.json();
        setJobId(data.jobId);
    };

    useEffect(() => {
        if (!jobId) return;

        const eventName = `job-result-${jobId}`;

        socket.on(eventName, result => {
            setResult(result.run.output);
            if (result.run.stderr) setIsError(true);
            else setIsError(false)

            socket.off(eventName);
        });

        return () => {
            socket.off(eventName);
        };
    }, [jobId]);

    return (
        <div className="flex flex-col gap-2 w-100 m-20">
            <textarea
                value={code}
                onChange={e => {
                    setCode(e.target.value);
                }}
                className="border-2"
            />
            <input
                type="text"
                value={input}
                onChange={e => {
                    setInput(e.target.value);
                }}
                className="border-2"
            />
            <button className="border" onClick={executeCode}>
                Run Code
            </button>
            {isError ? <pre className="text-red-600">{result}</pre> : <pre>{result}</pre>}
        </div>
    );
}
