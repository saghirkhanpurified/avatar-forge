"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Ensure we use the optimized Image component

const LOADING_MSGS = ["Starting the drawing...", "Adding colors...", "Making it pixel perfect...", "Finishing up..."];

const vaultItems = [
  { id: "084", src: "/vault-1.png", prompt: "A cyberpunk hacker in a dark hoodie with glowing neon green glasses pixel art" },
  { id: "085", src: "/vault-2.png", prompt: "A fiery knight wearing heavy golden armor with glowing red eyes 16-bit sprite" },
  { id: "086", src: "/vault-3.png", prompt: "A cool ape wearing a golden crown and dark sunglasses retro pixel art" },
  { id: "087", src: "/vault-4.png", prompt: "An alien astronaut in a sleek white spacesuit with a purple visor pixel art" }
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState(""); 
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  useEffect(() => {
    const int = isGenerating ? setInterval(() => setLoadStep(p => (p + 1) % 4), 2500) : undefined;
    if (!isGenerating) setLoadStep(0);
    return () => clearInterval(int);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) return setError("Please type what you want us to draw.");
    setIsGenerating(true); setIsLoaded(false); setError(""); setImgUrl(""); 
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }), 
      });
      if (!res.ok) throw new Error("Servers are busy. Please try again.");
      const data = await res.json();
      setImgUrl(data.imageUrl); 
    } catch (err: any) { setError(err.message); } 
    finally { setIsGenerating(false); }
  };

  const handleDownload = async () => {
    if (!imgUrl) return;
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `avatar-forge-art-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) { setError("Download blocked. Right-click and 'Save Image As'."); }
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50 text-slate-600 font-sans selection:bg-violet-200 overflow-x-hidden flex flex-col relative">
      <NavBar />

      {/* Background - Optimized with CSS instead of heavy images */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-400/5 blur-[100px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-violet-400/5 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        <section id="terminal" className="scroll-mt-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-24 pb-20 flex flex-col lg:flex-row items-center gap-10 sm:gap-16 min-h-[85vh]">
          
          <div className="flex-1 text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-[10px] font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
              Free AI Engine
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05]">
              CREATE FREE <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">NFT ART.</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Type any prompt and forge unique 1-of-1 pixel art characters instantly. No wallet, no fees, just art.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#about" className="text-sm font-bold text-slate-500 hover:text-slate-900 border-b-2 border-slate-200 hover:border-violet-600 pb-1 transition-all">Story</a>
              <span className="text-slate-300">|</span>
              <a href="#guides" className="text-sm font-bold text-violet-600 hover:text-violet-700 border-b-2 border-transparent hover:border-violet-600 pb-1 transition-all">Design Guides</a>
            </div>
          </div>

          <div className="w-full max-w-[440px] flex flex-col items-center">
            {/* GENERATOR CARD - CLS Protected with fixed aspect ratio */}
            <div className="w-full bg-white p-4 sm:p-6 rounded-[28px] shadow-xl border border-slate-200 relative mb-6">
              <div className="relative mb-6 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
                {isWorking && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
                    <p className="mt-4 text-violet-600 font-bold text-xs uppercase animate-pulse">{LOADING_MSGS[loadStep]}</p>
                  </div>
                )}
                {!imgUrl && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50">
                    <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Forging Station Ready</p>
                  </div>
                )}
                {imgUrl && (
                  <div className={`absolute inset-0 z-30 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
                    <img src={imgUrl} alt="AI Generated Pixel Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. A cyberpunk wizard..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-4 focus:ring-violet-500/10 outline-none text-sm transition-all" />
                <button onClick={handleGenerate} disabled={isWorking} className="w-full font-black tracking-widest uppercase py-4 rounded-xl shadow-lg bg-slate-900 hover:bg-black text-white disabled:opacity-50 transition-all">
                  {isWorking ? "Forging..." : "Forge Avatar"}
                </button>
              </div>
            </div>

            {/* A-ADS - Fixed Height to prevent Layout Shift */}
            <div className="w-full min-h-[114px] flex items-center justify-center bg-white rounded-[20px] border border-slate-200 p-3">
               <iframe data-aa='2435461' src='//acceptable.a-ads.com/2435461/?size=Adaptive' style={{ border: 0, padding: 0, width: '100%', height: '90px', overflow: 'hidden' }} title="Ad"></iframe>
            </div>
          </div>
        </section>

        {/* VAULT SECTION - Optimized with priority loading for the first row */}
        <section id="gallery" className="w-full bg-white py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-12">THE VAULT.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vaultItems.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-2 overflow-hidden group">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image 
                      src={item.src} 
                      alt={item.prompt} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-110"
                      style={{ imageRendering: "pixelated" }}
                      priority={i < 2} // Speed hack: Load the first two vault images immediately
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="guides" className="w-full bg-white py-24 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Design Guides</h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-violet-600">Free 16-Bit RPG Asset Creation</h3>
                <p className="text-slate-600 leading-relaxed">Forge game-ready characters in seconds. For a classic SNES look, use prompts like "flat shading" and "retro palette." Perfect for Unity or Godot indie builds.</p>
              </div>
              <div className="space-y-4 border-t border-slate-100 pt-8">
                <h3 className="text-xl font-bold text-violet-600">Discord & Web3 Optimization</h3>
                <p className="text-slate-600 leading-relaxed">For sharpest PFPs, use "nearest neighbor" scaling. Our 1-of-1 AI generations are user-owned and ready for NFT minting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Boring but necessary SEO Footer */}
        <footer className="w-full py-12 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} THE AVATAR FORGE. FORGED WITH AI.
          </p>
        </footer>
      </div>
    </main>
  );
}

// Sub-components kept lean for speed
function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-5 lg:px-10 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="font-black text-lg tracking-widest text-slate-900 flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-md shadow-sm" />
        <span>AVATAR FORGE</span>
      </div>
      <div className="hidden md:flex gap-8 text-[10px] font-black tracking-widest text-slate-400 uppercase">
        <a href="#gallery" className="hover:text-violet-600 transition-all">Vault</a>
        <a href="#guides" className="hover:text-violet-600 transition-all">Guides</a>
        <a href="#faq" className="hover:text-violet-600 transition-all">FAQ</a>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200">
      <h4 className="text-slate-900 font-bold text-sm mb-2 uppercase">{q}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
    </div>
  );
}