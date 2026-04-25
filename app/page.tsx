"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Pixel Font Import inside the component style
const pixelFont = "'Silkscreen', cursive";

const LOADING_MSGS = ["HEATING THE FORGE...", "HAMMERING PIXELS...", "COOLING THE IRON...", "FINAL POLISH..."];

const vaultItems = [
  { id: "084", src: "/vault-1.png", prompt: "Cyberpunk Hacker" },
  { id: "085", src: "/vault-2.png", prompt: "Fiery Knight" },
  { id: "086", src: "/vault-3.png", prompt: "Cool Ape King" },
  { id: "087", src: "/vault-4.png", prompt: "Alien Voyager" }
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState(""); 
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);

  useEffect(() => {
    const int = isGenerating ? setInterval(() => setLoadStep(p => (p + 1) % 4), 2000) : undefined;
    return () => clearInterval(int);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true); setIsLoaded(false); setImgUrl(""); 
    try {
      const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setImgUrl(data.imageUrl); 
    } catch (err) { setError("The Forge is too hot. Try again."); } 
    finally { setIsGenerating(false); }
  };

  const shareToX = () => {
    const text = encodeURIComponent("Just forged a unique 16-bit avatar on The Avatar Forge! 🪄🔥");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=https://theavatarforge.vercel.app`, "_blank");
  };

  return (
    <main className="min-h-screen w-full bg-[#0f172a] text-slate-200 selection:bg-violet-500/30 overflow-x-hidden relative font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <NavBar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <section className="pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black tracking-[0.2em] uppercase">
              Now Live: V1.0
            </div>
            <h1 style={{ fontFamily: pixelFont }} className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter">
              FORGE YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 animate-gradient-x">
                LEGACY.
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The internet's premier 16-bit AI engine. Create unique RPG assets and Web3 identities instantly. 
            </p>
            <div className="flex justify-center lg:justify-start gap-6">
              <button onClick={() => document.getElementById('forge-box')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] active:translate-y-1">
                START FORGING
              </button>
            </div>
          </motion.div>

          {/* THE FORGE BOX */}
          <motion.div 
            id="forge-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[480px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl relative group"
          >
            <div className="relative aspect-square rounded-2xl bg-black/40 border border-white/5 overflow-hidden mb-6 shadow-inner">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
                  >
                    <motion.div 
                      animate={{ rotate: [-20, 20, -20] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="text-6xl"
                    >
                      🔨
                    </motion.div>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: i*0.1 }} className="w-2 h-2 bg-violet-500 rounded-full" />)}
                    </div>
                    <p style={{ fontFamily: pixelFont }} className="text-violet-400 text-[10px] tracking-widest">{LOADING_MSGS[loadStep]}</p>
                  </motion.div>
                ) : !imgUrl ? (
                  <motion.div key="empty" className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 uppercase tracking-tighter font-black">
                    <span className="text-4xl mb-4 opacity-20">⚒️</span>
                    <p className="opacity-40">Awaiting Prompt</p>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                    <img src={imgUrl} alt="Forged Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                       <button onClick={shareToX} className="flex-1 py-3 bg-violet-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 transition-colors shadow-lg active:translate-y-0.5">SHARE ON X</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your character..."
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm focus:border-violet-500 outline-none transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-violet-500/20 active:translate-y-1 transition-all"
              >
                {isGenerating ? "FORGING PIXELS..." : "FORGE AVATAR"}
              </button>
            </div>
          </motion.div>
        </section>

        {/* VAULT SECTION */}
        <section className="py-24 border-t border-white/5">
          <h2 style={{ fontFamily: pixelFont }} className="text-2xl text-center mb-16 tracking-widest">TODAY&apos;S FEATURED FORGES</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {vaultItems.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, rotateZ: i % 2 === 0 ? 1 : -1 }}
                className="bg-white/5 border border-white/10 p-3 rounded-[24px] group cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image src={item.src} alt={item.prompt} fill className="object-cover" style={{ imageRendering: "pixelated" }} />
                </div>
                <div className="px-2 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500">#{item.id}</span>
                  <span className="text-[10px] font-black uppercase text-violet-400">{item.prompt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEO ACCORDION GUIDES */}
        <section id="guides" className="py-24 max-w-4xl mx-auto">
          <h2 style={{ fontFamily: pixelFont }} className="text-xl mb-12 text-center uppercase tracking-[0.3em]">Master the Forge</h2>
          <div className="space-y-4">
            {[
              { q: "How to Create 16-Bit RPG Assets", a: "For a classic SNES look, use prompts like 'flat shading' and 'limited color palette'. Perfect for Unity indie games." },
              { q: "Optimizing for Discord & Web3", a: "Always use nearest-neighbor scaling for sharp edges. Our 1-of-1 assets are ready for immediate NFT minting." }
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                <button 
                  onClick={() => setActiveGuide(activeGuide === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-slate-200">{item.q}</span>
                  <span className="text-violet-500 font-black">{activeGuide === i ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {activeGuide === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full py-6 px-4 sm:px-10 flex justify-between items-center sticky top-0 z-[100] bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
        <span style={{ fontFamily: pixelFont }} className="text-sm tracking-tighter">AVATAR FORGE</span>
      </div>
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <a href="#forge-box" className="hover:text-violet-400">Forge</a>
        <a href="#guides" className="hover:text-violet-400">Guides</a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 text-center bg-black/20">
      <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-8">
        <a href="/terms" className="hover:text-violet-400">Terms</a>
        <a href="/privacy" className="hover:text-violet-400">Privacy</a>
        <a href="https://x.com/SaghirWeb3" className="hover:text-violet-400">Support</a>
      </div>
      <p className="text-[9px] font-mono text-slate-700 tracking-widest">© 2026 THE AVATAR FORGE. FORGED IN PAKISTAN.</p>
    </footer>
  );
}