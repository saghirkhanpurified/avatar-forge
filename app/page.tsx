"use client";

import { useState, useEffect } from "react";

const LOADING_MSGS = ["Analyzing prompt...", "Structuring pixel grid...", "Applying color palette...", "Finalizing avatar..."];

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
    if (!prompt) return setError("Please enter a character description.");
    
    setIsGenerating(true); setIsLoaded(false); setError(""); setImgUrl(""); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }), 
      });
      if (!res.ok) throw new Error("Our servers are busy. Please try again.");
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
      setError("Download blocked. You can right-click the image and select 'Save Image As'.");
    }
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);

  return (
    <main className="min-h-[100dvh] w-full bg-white text-gray-900 font-sans selection:bg-purple-200 overflow-x-hidden flex flex-col relative">
      <NavBar />

      {/* HERO SECTION WITH GENERATOR */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Marketing Pitch */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold tracking-wide uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            Mint Engine Pro v2.0
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-[1.05]">
            Generate your <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">perfect avatar.</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Stop using generic profile pictures. Describe your ultimate character, and our AI will forge a premium, custom retro avatar instantly. Yours to download and own forever.
          </p>
        </div>

        {/* Right Side: The Generator Tool */}
        <div className="w-full max-w-[420px] bg-white p-6 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="relative mb-6 w-full aspect-square rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
            
            {isWorking && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-gray-50 z-20">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-gray-600 font-semibold text-sm animate-pulse">
                  {isGenerating ? LOADING_MSGS[loadStep] : "Downloading your art..."}
                </p>
              </div>
            )}

            {!imgUrl && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-50 z-10">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <p className="text-gray-900 font-bold text-base">Awaiting your vision</p>
                <p className="text-gray-500 text-xs mt-1">Enter a prompt below to begin.</p>
              </div>
            )}

            {imgUrl && (
              <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${isLoaded && !isWorking ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <img src={imgUrl} alt="Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                {isLoaded && !isWorking && (
                  <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16">
                    <button onClick={handleDownload} className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm shadow-xl flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      DOWNLOAD AVATAR
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 mb-4 text-center text-xs font-bold bg-red-50 py-2.5 rounded-xl border border-red-100">{error}</p>}

          <div className="space-y-3 relative z-10">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. A neon cyberpunk hacker, A gold ape..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none text-sm transition-all" />
            <button onClick={handleGenerate} disabled={isWorking} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 text-sm tracking-wide">
              {isWorking ? "INITIALIZING ENGINE..." : "GENERATE AVATAR"}
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-12">How it works.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number="1" title="Describe Your Character" desc="Use natural language to tell our engine exactly what kind of avatar you want. Be as specific or as wild as you like." />
            <StepCard number="2" title="AI Forging" desc="Our custom-tuned AI model converts your text into a cohesive, high-quality 128x128 pixel art masterpiece in seconds." />
            <StepCard number="3" title="Download & Dominate" desc="Instantly download your new asset and use it on Discord, Twitter, Twitch, or your favorite gaming platforms." />
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <h2 className="text-3xl font-black text-gray-900">About Mint Engine.</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          We believe that your digital identity should be unique. In a world of generic stock photos and repetitive profile pictures, Mint Engine empowers anyone to become a creator. We leverage cutting-edge artificial intelligence to democratize high-quality pixel art. Whether you are a gamer, a developer, or a brand, we provide the tools to forge an identity that stands out.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 border-t border-gray-100 bg-white text-center">
        <p className="text-gray-400 text-sm font-medium">© {new Date().getFullYear()} Mint Engine Pro. Built for creators.</p>
      </footer>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 lg:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg shadow-sm" />
        <span className="hidden sm:inline">Mint Engine</span>
      </div>
      <div className="flex gap-6 text-sm font-bold text-gray-500">
        <a href="#" className="hover:text-gray-900 transition-colors">Features</a>
        <a href="#" className="hover:text-gray-900 transition-colors">About</a>
      </div>
    </nav>
  );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-purple-100 text-purple-600 font-black rounded-full flex items-center justify-center text-xl mb-6">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}