"use client"; // Next.js'e bu sayfanın interaktif olduğunu söyler
import { useState } from 'react';

export default function Home() {
    const [status, setStatus] = useState("IDLE");

    const handleExecute = async (e: any) => {
        e.preventDefault();
        setStatus("TRANSMITTING");
        
        const res = await fetch('/api/send', {
            method: 'POST',
            body: JSON.stringify({
                user: e.target.user.value,
                msg: e.target.msg.value
            })
        });

        setStatus(res.ok ? "SUCCESS" : "ERROR");
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <form onSubmit={handleExecute} className="w-full max-w-sm border border-zinc-800 p-6 rounded-sm space-y-4">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                    <span>Node: v18.0.2</span>
                    <span className={status === "TRANSMITTING" ? "animate-pulse text-yellow-500" : ""}>Status: {status}</span>
                </div>
                
                <input name="user" required placeholder="AUTH_ID" className="w-full bg-zinc-900 border border-zinc-800 p-2 text-zinc-200 font-mono text-sm focus:border-blue-500 outline-none" />
                <textarea name="msg" required placeholder="ENCRYPTED_PAYLOAD" className="w-full bg-zinc-900 border border-zinc-800 p-2 text-zinc-200 font-mono text-sm h-32 focus:border-blue-500 outline-none" />
                
                <button className="w-full border border-zinc-700 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                    INITIATE_UPSTREAM
                </button>
            </form>
        </main>
    );
}
