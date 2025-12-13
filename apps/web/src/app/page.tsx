"use client";
import api from "@/libs/axios";
import socket from "@/libs/socket";
import { useEffect, useState } from "react";

socket.connect();

type Message = {
    sender: string;
    message: string;
    time: string;
};

type codeResult = {
    sender: string;
    output: string;
    cpuTime: number;
    isError: boolean;
};

export default function Home() {
    const [jobId, setJobId] = useState<string>("");
    const [result, setResult] = useState("");
    const [code, setCode] = useState("");
    const [input, setInput] = useState("");
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [codeResults, setCodeResults] = useState<codeResult[]>([]);

    const executeCode = async () => {
        const { data } = await api.post("/execute", {
            language: "python",
            code,
            input,
        });
        setJobId(data.jobId);
    };

    const sendMessage = async () => {
        if (message.trim()) {
            socket.emit("sendMessage", { sender: "user", message, time: new Date() });
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    useEffect(() => {
        socket.on("recieveMessage", result => {
            const time = new Date(result.time).toLocaleTimeString();
            setAllMessages(prevMessages => [
                ...prevMessages,
                {
                    ...result,
                    time,
                },
            ]);
        });

        socket.on("recieveResult", result => {
            console.log(result);
            const isError = result.run.stderr.trim() ? true : false;
            setCodeResults(prevCodeResults => [
                ...prevCodeResults,
                {
                    sender: "user",
                    output: result.run.output,
                    cpuTime: result.run.cpu_time,
                    isError,
                },
            ]);
        });

        return () => {
            socket.off("recieveMessage");
            socket.off("recieveResult");
        };
    }, []);

    return (
        <div className="flex flex-col gap-2 w-100 m-20">
            <textarea
                value={code}
                onChange={e => {
                    setCode(e.target.value);
                }}
                className="border-2 p-2"
                placeholder="Write Your Code Here"
            />
            <input
                type="text"
                value={input}
                onChange={e => {
                    setInput(e.target.value);
                }}
                className="border-2 p-2"
                placeholder="Input"
            />
            <button className="border" onClick={executeCode}>
                Run Code
            </button>
            <div className="border-2 h-40  p-2 flex flex-col justify-between gap-2">
                <div className="overflow-scroll">
                    {allMessages.map(m => (
                        <div className="text-xs border-b flex justify-between p-1">
                            <div className="flex gap-2 items-center justify-center">
                                <pre>{m.sender}:</pre>
                                <pre>{m.message}</pre>
                            </div>
                            <pre>{m.time}</pre>
                        </div>
                    ))}
                </div>
                <div className="border flex items-center justify-start">
                    <input
                        type="text"
                        value={message}
                        className="text-xs p-1 flex-3 outline-0"
                        placeholder="Your Message..."
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={sendMessage} className="flex-1 border-l text-xs h-full">
                        Send Message
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                {codeResults.map(code => (
                    <div className="border-2 flex flex-col p-2">
                        <div className="border-b">
                            <pre>
                                {code.sender}'s code executed in {code.cpuTime}s
                            </pre>
                        </div>
                        {code.isError ? (
                            <pre className="text-red-600 text-xs">{code.output}</pre>
                        ) : (
                            <pre className="p-2">{code.output}</pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
