'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Menu, X, Wind, Sparkles, History, Zap } from 'lucide-react';
import { MusicCard } from '@/components/MusicCard';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: string;
  music_data?: {
    videoId: string;
    title: string;
    reason: string;
    mood?: string;
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there. I'm SoulSync. How are you feeling right now? I'm here to listen.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      // Enhance mock data with mood if missing, for the MusicCard
      if (data.music_data && !data.music_data.mood) {
        data.music_data.mood = "Calm Focus";
      }

      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error("Failed to fetch response", error);
      // Fallback error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm having a little trouble connecting right now, but I'm still here with you.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen text-slate-100 font-sans">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || typeof window !== 'undefined' && window.innerWidth > 768) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={clsx(
              "fixed inset-y-0 left-0 z-20 w-72 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 p-6 md:relative md:translate-x-0 md:opacity-100",
              !isSidebarOpen && "hidden md:block"
            )}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400"></div>
              <h1 className="text-2xl font-bold tracking-tight text-white">SoulSync</h1>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Emotional Shifts
                </h3>
                <div className="space-y-2">
                  <div className="text-sm p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Today, 10:23 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">Anxious</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-teal-400">Calm</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Quick Relief
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-all border border-indigo-500/20 text-sm font-medium">
                    <Wind className="w-4 h-4" /> Breathing Exercise
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-all border border-teal-500/20 text-sm font-medium">
                    <Sparkles className="w-4 h-4" /> 5-Min Meditation
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400"></div>
            <span className="font-bold">SoulSync</span>
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={clsx(
                "max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm",
                msg.role === 'user'
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-white/10 backdrop-blur-md border border-white/5 text-slate-100 rounded-bl-sm"
              )}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {msg.music_data && (
                  <MusicCard
                    videoId={msg.music_data.videoId}
                    reason={msg.music_data.reason}
                    mood={msg.music_data.mood || "Healing"}
                  />
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start w-full"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl rounded-bl-sm p-4 flex gap-1 items-center h-12">
                <motion.div
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent">
          <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type how you're feeling..."
                className="w-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-full py-4 pl-6 pr-12 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500/50"
              />
              <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 cursor-pointer hover:text-indigo-400 transition-colors" />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-slate-600 text-xs mt-3">
            SoulSync is an AI companion. Not a replacement for professional help.
          </p>
        </div>
      </main>
    </div>
  );
}
