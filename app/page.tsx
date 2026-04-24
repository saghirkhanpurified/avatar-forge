"use client";

import { useState, useEffect } from "react";

const LOADING_MSGS = ["Analyzing prompt...", "Forcing pixel grid...", "Applying retro palette...", "Finalizing block art..."];

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
    if (!prompt) return setError("What should I create for you?");
    
    setIsGenerating(true); setIsLoaded(false); setError(""); setImgUrl(""); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }), 
      });
      if (!res.ok) throw new Error("The Forge is busy. Try again!");
      setImgUrl((await res.json()).imageUrl); 
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
      link.download = `mint-engine-avatar-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Download blocked. You can right-click the image and select 'Save As'.");
    }
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);

  return (
    <main className="min-h-[100dvh] w-full bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden flex flex-col relative">
      <NavBar />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto w-full px-4 sm:px-6 gap-10 lg:gap-16 pt-28 pb-16 lg:pt-16">
        <MarketingPitch />

        <div className="w-full max-w-[380px] bg-[#0a0a0c] p-5 rounded-[28px] shadow-[0_0_80px_rgba(168,85,247,0.08)] border border-gray-800/80 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-purple-600/10 blur-[40px] pointer-events-none" />

          <div className="relative mb-5 w-full aspect-square rounded-2xl border border-gray-800 bg-[#0d0d12] overflow-hidden shadow-inner">
            
            {isWorking && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#0d0d12] z-20">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-purple-400 font-medium text-xs animate-pulse">
                  {isGenerating ? LOADING_MSGS[loadStep] : "Downloading avatar..."}
                </p>
              </div>
            )}

            {!imgUrl && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0d0d12] z-10">
                <svg className="w-10 h-10 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 font-medium text-sm">Awaiting your vision</p>
              </div>
            )}

            {imgUrl && (
              <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${isLoaded && !isWorking ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <img 
                  src={imgUrl} 
                  alt="Art" 
                  className="w-full h-full object-cover" 
                  style={{ imageRendering: "pixelated" }} 
                  onLoad={() => setIsLoaded(true)} 
                  crossOrigin="anonymous" 
                />

                {isLoaded && !isWorking && (
                  <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                    <button onClick={handleDownload} className="w-full bg-white hover:bg-gray-200 text-black font-black py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm shadow-2xl flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      DOWNLOAD AVATAR
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 mb-3 text-center text-xs font-bold bg-red-950/30 py-2 rounded-lg border border-red-900/50">{error}</p>}

          <div className="space-y-3 relative z-10">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. A neon zombie, A gold ape..." className="w-full bg-[#121217] border border-gray-800 rounded-xl p-3.5 focus:border-purple-500 outline-none text-sm shadow-inner" />
            <button onClick={handleGenerate} disabled={isWorking} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 text-xs tracking-wide">
              {isWorking ? "INITIALIZING..." : "GENERATE AVATAR"}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 lg:px-8 border-b border-gray-900/50 bg-black/50 backdrop-blur-md absolute top-0 z-40">
      <div className="font-black text-lg tracking-widest text-white flex items-center gap-2">
        <div className="w-5 h-5 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-md" />
        <span className="hidden sm:inline">MINT ENGINE</span> <span className="text-purple-500">PRO</span>
      </div>
    </nav>
  );
}

function MarketingPitch() {
  return (
    <div className="flex-1 text-center lg:text-left space-y-6 w-full max-w-lg">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-[1.1]">
        FORGE YOUR <br className="hidden sm:block"/> <span className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">CUSTOM</span> AVATAR.
      </h1>
      <p className="text-gray-400 text-base leading-relaxed px-2 lg:px-0">
        Describe your character, let our AI generate a custom retro pixel avatar, and download it instantly to use across the internet.
      </p>
      <div className="space-y-4 pt-6 border-t border-gray-900 text-left">
        <Feature icon="👑" title="Own Your Identity" desc="Use your custom generated avatar on any social media, Discord, or gaming platform." />
        <Feature icon="👾" title="Premium AI Pixel Art" desc="Our Engine forces every generation into a cohesive, high-quality 128x128 pixel aesthetic." />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-purple-900/30 p-2.5 rounded-lg border border-purple-500/20 text-purple-400 mt-1 shrink-0">{icon}</div>
      <div>
        <h3 className="text-white font-bold text-base">{title}</h3>
        <p className="text-gray-600 text-xs mt-1">{desc}</p>
      </div>
    </div>
  );
}