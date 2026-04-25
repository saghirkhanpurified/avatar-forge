"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const pixelFont = "'Silkscreen', cursive";
const LOADING_MSGS = ["HEATING THE FORGE...", "HAMMERING PIXELS...", "COOLING THE IRON...", "FINAL POLISH..."];

const vaultItems = [
  { id: "084", src: "/vault-1.png", prompt: "Cyberpunk Hacker in dark hoodie" },
  { id: "085", src: "/vault-2.png", prompt: "Fiery Knight in golden armor" },
  { id: "086", src: "/vault-3.png", prompt: "Cool Ape King with crown" },
  { id: "087", src: "/vault-4.png", prompt: "Alien Astronaut in white suit" }
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState(""); 
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  
  // ELITE FEATURE 2: Theming Engine State
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // ELITE FEATURE 1: Interactive Background Mouse Tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ELITE FEATURE 3: Local History State
  const [history, setHistory] = useState<{url: string, prompt: string}[]>([]);

  useEffect(() => {
    // Load History on mount
    const savedHistory = localStorage.getItem("forgeHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Mouse tracking listener
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const int = isGenerating ? setInterval(() => setLoadStep(p => (p + 1) % 4), 2000) : undefined;
    return () => clearInterval(int);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true); setImgUrl(""); setError("");
    try {
      const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setImgUrl(data.imageUrl); 
      
      // Save to History
      const newHistory = [{ url: data.imageUrl, prompt }, ...history];
      setHistory(newHistory);
      localStorage.setItem("forgeHistory", JSON.stringify(newHistory));
      
    } catch (err) { setError("The Forge is too hot. Try again."); } 
    finally { setIsGenerating(false); }
  };

  const shareToX = () => {
    const text = encodeURIComponent("Just forged a unique 16-bit avatar on The Avatar Forge! 🪄🔥");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=https://theavatarforge.vercel.app`, "_blank");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Theme Variables
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#0f172a] text-slate-200" : "bg-slate-50 text-slate-800";
  const cardClass = isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl";
  const inputClass = isDark ? "bg-black/20 border-white/10 text-white placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <main className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative font-sans ${bgClass}`}>
      
      {/* ELITE FEATURE 1: Interactive Mouse-Tracking Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
          className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 ${isDark ? 'bg-violet-600/30' : 'bg-violet-300/40'}`}
        />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-300/20'} blur-[120px] rounded-full`} />
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] ${isDark ? 'opacity-10' : 'opacity-[0.03]'}`} />
      </div>

      <nav className={`w-full py-6 px-4 sm:px-10 flex justify-between items-center sticky top-0 z-[100] backdrop-blur-md border-b transition-colors duration-500 ${isDark ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          <span style={{ fontFamily: pixelFont }} className="text-sm tracking-tighter">AVATAR FORGE</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <a href="#gallery" className="hover:text-violet-500 transition-colors hidden sm:block">Vault</a>
          <button onClick={toggleTheme} className="p-2 rounded-full border border-slate-500/20 hover:bg-slate-500/10 transition-colors text-lg">
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <section className="pt-20 pb-24 flex flex-col lg:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 text-center lg:text-left space-y-8">
            <div className={`inline-block px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase ${isDark ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-violet-100 border-violet-200 text-violet-700'}`}>
              Ultimate Edition
            </div>
            <h1 style={{ fontFamily: pixelFont }} className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter">
              FORGE YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 animate-gradient-x">LEGACY.</span>
            </h1>
            <p className={`${textMuted} text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed`}>
              The internet's premier 16-bit AI engine. Create unique RPG assets and Web3 identities instantly. No wallet required.
            </p>
          </motion.div>

          <motion.div id="forge-box" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-[480px] backdrop-blur-xl border p-6 rounded-[32px] transition-colors duration-500 ${cardClass}`}>
            <div className={`relative aspect-square rounded-2xl border overflow-hidden mb-6 shadow-inner ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                    <motion.div animate={{ rotate: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 0.5 }} className="text-6xl">🔨</motion.div>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: i*0.1 }} className="w-2 h-2 bg-violet-500 rounded-full" />)}
                    </div>
                    <p style={{ fontFamily: pixelFont }} className={`text-[10px] tracking-widest ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{LOADING_MSGS[loadStep]}</p>
                  </motion.div>
                ) : !imgUrl ? (
                  <motion.div key="empty" className="absolute inset-0 flex flex-col items-center justify-center uppercase tracking-tighter font-black opacity-30">
                    <span className="text-4xl mb-4">⚒️</span>
                    <p>Awaiting Prompt</p>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                    <img src={imgUrl} alt="Forged Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                       <button onClick={shareToX} className="flex-1 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 transition-colors shadow-lg active:translate-y-0.5">SHARE ON X</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="space-y-4">
              <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your character..." className={`w-full rounded-xl p-4 text-sm outline-none transition-all border focus:ring-2 focus:ring-violet-500/50 ${inputClass}`} />
              <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-black active:translate-y-1 transition-all disabled:opacity-50">
                {isGenerating ? "FORGING PIXELS..." : "FORGE AVATAR"}
              </button>
            </div>
          </motion.div>
        </section>

        {/* ELITE FEATURE 3: Local History Dashboard */}
        {history.length > 0 && (
          <section className={`py-16 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
            <h2 style={{ fontFamily: pixelFont }} className="text-xl mb-8 tracking-widest flex items-center justify-between">
              YOUR RECENT FORGES
              <span className={`text-[10px] font-sans px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>Local Storage</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {history.map((item, i) => (
                <div key={i} className={`min-w-[150px] sm:min-w-[200px] aspect-square rounded-xl overflow-hidden border snap-start shrink-0 relative group ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <span className="text-[10px] text-white font-bold uppercase">{item.prompt}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VAULT SECTION */}
        <section id="gallery" className={`py-24 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <h2 style={{ fontFamily: pixelFont }} className="text-2xl text-center mb-16 tracking-widest">TODAY&apos;S FEATURED FORGES</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {vaultItems.map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10, rotateZ: i % 2 === 0 ? 1 : -1 }} className={`border p-3 rounded-[24px] group cursor-pointer shadow-lg transition-colors duration-500 ${cardClass}`}>
                <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isDark ? 'bg-black/50' : 'bg-slate-100'}`}>
                  <Image src={item.src} alt={item.prompt} fill className="object-cover" style={{ imageRendering: "pixelated" }} />
                </div>
                <div className="px-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className={`text-[10px] font-mono ${textMuted}`}>#{item.id}</span>
                  <span className={`text-[9px] font-black uppercase text-right truncate w-full sm:w-auto ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{item.prompt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
      
      <footer className={`py-12 border-t text-center transition-colors duration-500 ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-white'}`}>
        <p className={`text-[9px] font-mono tracking-widest ${textMuted}`}>© {new Date().getFullYear()} THE AVATAR FORGE.</p>
      </footer>
    </main>
  );
}