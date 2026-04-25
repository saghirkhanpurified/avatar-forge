"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    } catch (err) { setError("Download blocked."); }
  };

  const shareToX = () => {
    const text = encodeURIComponent("Just forged a unique 16-bit avatar on The Avatar Forge! 🪄🔥\n\nCreate yours for free here:");
    const url = "https://theavatarforge.vercel.app";
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50 text-slate-700 font-sans selection:bg-violet-200 overflow-x-hidden flex flex-col relative">
      <NavBar />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-400/10 blur-[100px] sm:blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-violet-400/10 blur-[100px] sm:blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10">
        <section id="terminal" className="scroll-mt-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-24 pb-20 flex flex-col lg:flex-row items-center gap-10 sm:gap-16 min-h-[85vh]">
          
          <div className="flex-1 text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
              Free to use
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05]">
              CREATE FREE <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">NFT ART.</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Type what you want to see, and our AI will draw a completely unique pixel art character for you. It's 100% free to use.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#about" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors border-b-2 border-slate-300 hover:border-violet-600 pb-1">Our Story</a>
              <span className="text-slate-300 hidden sm:block">|</span>
              <a href="#guides" className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors border-b-2 border-transparent hover:border-violet-600 pb-1">Design Guides</a>
            </div>
          </div>

          <div className="w-full max-w-[440px] flex flex-col items-center">
            <div className="w-full bg-white p-4 sm:p-6 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200 relative mb-6">
              <div className="relative mb-5 sm:mb-6 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
                {isWorking && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-50/90 z-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
                    <p className="text-violet-600 font-bold text-[10px] uppercase animate-pulse">{LOADING_MSGS[loadStep]}</p>
                  </div>
                )}
                {!imgUrl && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ready to Forge</p>
                  </div>
                )}
                {imgUrl && (
                  <div className={`absolute inset-0 z-30 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
                    <img src={imgUrl} alt="AI Generated Pixel Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                    {isLoaded && !isWorking && (
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent pt-20 flex gap-2">
                        <button onClick={handleDownload} className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-black tracking-widest uppercase py-3 rounded-xl transition-all text-[10px] shadow-xl">
                          DOWNLOAD
                        </button>
                        <button onClick={shareToX} className="bg-violet-600 hover:bg-violet-700 text-white font-black tracking-widest uppercase px-4 py-3 rounded-xl transition-all text-[10px] shadow-xl flex items-center gap-2">
                          SHARE <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isWorking} placeholder="A cyberpunk wizard..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none text-sm text-slate-900 placeholder-slate-500 focus:ring-4 focus:ring-violet-500/10 transition-all" />
                <button onClick={handleGenerate} disabled={isWorking} className="w-full font-black tracking-widest uppercase py-4 rounded-xl shadow-lg bg-slate-900 hover:bg-black text-white disabled:opacity-50 transition-all">
                  {isWorking ? "FORGING..." : "FORGE AVATAR"}
                </button>
              </div>
            </div>
            <div className="w-full min-h-[114px] bg-white rounded-[20px] border border-slate-200 shadow-sm flex items-center justify-center p-3">
               <iframe data-aa='2435461' src='//acceptable.a-ads.com/2435461/?size=Adaptive' style={{ border: 0, padding: 0, width: '100%', height: '90px', overflow: 'hidden' }} title="Ad"></iframe>
            </div>
          </div>
        </section>

        <section id="gallery" className="w-full bg-white py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-16 uppercase">The Vault.</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {vaultItems.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-3 group">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <Image src={item.src} alt={item.prompt} fill sizes="25vw" className="object-cover" style={{ imageRendering: "pixelated" }} priority={i < 2} />
                  </div>
                  <div className="w-full flex justify-between items-center px-2">
                    <span className="text-[10px] text-slate-400 font-mono font-bold">#{item.id}</span>
                    <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-violet-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="w-full bg-slate-900 py-24 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">From Pakistan to the World.</h2>
            <div className="w-20 h-1 bg-violet-500 mx-auto"></div>
            <p className="text-slate-400 text-lg leading-loose italic">
              "I built The Avatar Forge because I love the 16-bit era and I hate high barriers to entry. 
              This is a solo-dev project made to give indie creators the assets they need without the price tag. 
              If this tool helps you, consider supporting the journey."
            </p>
            <a href="https://www.buymeacoffee.com" target="_blank" className="inline-block bg-white text-slate-900 font-black tracking-widest uppercase px-8 py-4 rounded-2xl hover:scale-105 transition-transform">
              ☕ Support the Creator
            </a>
          </div>
        </section>

        <section id="guides" className="w-full bg-white py-24 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase">Design Guides</h2>
            <div className="grid grid-cols-1 gap-12 text-left">
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

        <footer className="w-full py-16 bg-slate-50 border-t border-slate-200 text-center px-4">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-8">
            <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="/sitemap.xml" className="hover:text-slate-900 transition-colors">Sitemap</a>
            <a href="https://x.com/SaghirWeb3" className="hover:text-slate-900 transition-colors">Twitter</a>
          </div>
          <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} THE AVATAR FORGE. FORGED WITH HEART.
          </p>
        </footer>
      </div>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-5 lg:px-10 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="font-black text-lg tracking-widest text-slate-900 flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-md" />
        <span className="uppercase">Avatar Forge</span>
      </div>
      <div className="hidden md:flex gap-8 text-[10px] font-black tracking-widest text-slate-500 uppercase">
        <a href="#gallery" className="hover:text-violet-600 transition-all">Vault</a>
        <a href="#about" className="hover:text-violet-600 transition-all">About</a>
        <a href="#guides" className="hover:text-violet-600 transition-all">Guides</a>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-black text-slate-900 mb-2 uppercase">{title}</h3>
      <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="text-slate-900 font-black text-sm uppercase mb-3">{q}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
    </div>
  );
}