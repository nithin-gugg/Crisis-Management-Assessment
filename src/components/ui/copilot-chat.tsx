"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, ArrowRight, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    cta?: { show: boolean; label: string; url: string };
    followUp?: string;
    suggestions?: string[];
};

export function CopilotChat() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;
        
        if (!isOpen) setIsOpen(true);

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
        const newMessages = [...messages, userMsg];
        
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare history for API
            const apiMessages = newMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch('/api/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!response.ok) throw new Error("API failed");

            const data = await response.json();

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.text,
                cta: data.cta,
                followUp: data.follow_up_question,
                suggestions: data.suggestions
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm currently unable to connect to the analysis engine.",
                cta: { show: true, label: "Start Crisis Assessment", url: "/assessment" },
                suggestions: ["Start Assessment"]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleTagClick = (tag: string) => {
        sendMessage(tag);
    };

    return (
        <>
            {/* INLINE IDLE STATE */}
            <section className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How can I help today?</h2>
                <p className="text-gray-400 mb-10 text-center">Ask Sentinel's AI copilot to analyze risk or initiate a playbook.</p>

                <div className="w-full bg-[#111827] border border-gray-700 rounded-2xl p-4 shadow-xl">
                    <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-4 flex flex-col min-h-[120px]">
                        <textarea
                            className="w-full bg-transparent resize-none text-white outline-none placeholder-gray-500 flex-1 custom-scrollbar"
                            placeholder={messages.length === 0 ? "Hi, I'm your AI assistant..." : "Continue chatting with Sentinel..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <button className="text-gray-400 hover:text-white transition"><Mic size={20} /></button>
                            <button 
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 disabled:bg-gray-700 disabled:text-gray-400 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {messages.length === 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mt-6 w-full max-w-3xl">
                        {['Run continuity drill', 'Simulate supply chain disruption', 'Review crisis playbooks', 'Help me plan'].map((tag, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleTagClick(tag)}
                                className="bg-[#111827] border border-gray-700 hover:bg-gray-800 hover:border-gray-500 text-xs text-gray-300 py-2 px-4 rounded-full transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
                
                {messages.length > 0 && !isOpen && (
                    <button onClick={() => setIsOpen(true)} className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium border border-blue-500/30 py-2 px-4 rounded-full transition bg-blue-500/5">
                        Resume Chat History
                    </button>
                )}
            </section>

            {/* DRAWER BACKDROP */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" 
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            {/* SLIDING DRAWER */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0b0f19] shadow-2xl border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#111827]">
                    <div className="flex items-center gap-2">
                        <Bot size={20} className="text-blue-500" />
                        <span className="font-semibold text-white">Sentinel Copilot</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col gap-6">
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-[#111827] border border-gray-700'}`}>
                                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-400" />}
                                </div>
                                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#111827] border border-gray-800 text-gray-200 rounded-tl-none'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    {msg.role === 'assistant' && msg.followUp && (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap mt-4 font-medium text-gray-100">{msg.followUp}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Actions below assistant message */}
                            {msg.role === 'assistant' && (
                                <div className="mt-3 ml-11 flex flex-col items-start gap-3 w-full">
                                    {msg.cta?.show && (
                                        <button 
                                            onClick={() => router.push(msg.cta!.url)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2 px-5 rounded-lg transition flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                        >
                                            {msg.cta.label} <ArrowRight size={16} />
                                        </button>
                                    )}
                                    {msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {msg.suggestions.map((suggestion, sIdx) => (
                                                <button 
                                                    key={sIdx}
                                                    onClick={() => sendMessage(suggestion)}
                                                    className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/60 bg-[#111827] py-1.5 px-3 rounded-full transition text-left flex items-center gap-1.5"
                                                >
                                                    <span className="text-blue-500 font-bold">✓</span> {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#111827] border border-gray-700 flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-blue-400" />
                            </div>
                            <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 rounded-tl-none flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-gray-400" />
                                <span className="text-sm text-gray-400">Sentinel is analyzing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-800 bg-[#111827]">
                    <div className="bg-[#0b0f19] border border-gray-700 rounded-xl p-3 flex flex-col min-h-[100px]">
                        <textarea
                            className="w-full bg-transparent resize-none text-white outline-none placeholder-gray-500 flex-1 custom-scrollbar text-sm"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <button className="text-gray-400 hover:text-white transition"><Mic size={18} /></button>
                            <button 
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 disabled:bg-gray-700 disabled:text-gray-400 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
