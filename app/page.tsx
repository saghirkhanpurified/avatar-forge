"use client";

import { useState, useEffect } from "react";

const LOADING_MSGS = ["Connecting to Node...", "Compiling Trait DNA...", "Rendering Pixel Grid...", "Minting Asset..."];

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
    if (!prompt) return setError("Enter a character description to begin.");
    
    setIsGenerating(true); setIsLoaded(false); setError(""); setImgUrl(""); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }), 
      });
      if (!res.ok) throw new Error("The Network is congested. Try again.");
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
      link.download = `nexus-asset-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Download blocked. Right-click and 'Save Image As'.");
    }
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);

  return (
    <main className="min-h-[100dvh] w-full bg-[#050505] text-gray-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden scroll-smooth flex flex-col relative">
      <NavBar />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section id="terminal" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
          
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]"></span>
              Mainnet Live
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05]">
              CREATE YOUR <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">1-OF-1 ASSET.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              The ultimate AI-powered NFT creation terminal. Bypass the artists, bypass the developers. Input your vision, and our neural engine will forge a pristine, mint-ready retro avatar directly to your hard drive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#about" className="text-sm font-bold text-gray-400 hover:text-white transition-colors border-b border-gray-800 hover:border-cyan-400 pb-1">
                Read the Manifesto
              </a>
            </div>
          </div>

          {/* THE GENERATOR TERMINAL */}
          <div className="w-full max-w-[440px] bg-[#0a0a0c] p-6 rounded-[24px] shadow-[0_0_80px_rgba(0,240,255,0.05)] border border-gray-800 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            
            <div className="relative mb-6 w-full aspect-square rounded-xl border border-gray-800 bg-[#050505] overflow-hidden shadow-inner">
              
              {isWorking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-[#050505] z-20">
                  <div className="w-10 h-10 border-4 border-gray-800 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
                  <p className="text-cyan-400 font-bold text-xs tracking-widest uppercase animate-pulse">
                    {isGenerating ? LOADING_MSGS[loadStep] : "Extracting Image Data..."}
                  </p>
                </div>
              )}

              {!imgUrl && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#050505] z-10">
                  <div className="w-16 h-16 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  </div>
                  <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">System Ready</p>
                  <p className="text-gray-600 text-[11px] mt-2">Awaiting prompt parameters.</p>
                </div>
              )}

              {imgUrl && (
                <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${isLoaded && !isWorking ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <img src={imgUrl} alt="Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                  {isLoaded && !isWorking && (
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
                      <button onClick={handleDownload} className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black tracking-widest uppercase py-3.5 rounded-lg transition-all active:scale-[0.98] text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        SECURE ASSET
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <p className="text-fuchsia-400 mb-4 text-center text-[11px] uppercase tracking-wider font-bold bg-fuchsia-950/30 py-3 rounded-lg border border-fuchsia-900/50">{error}</p>}

            <div className="space-y-4 relative z-10">
              <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. A neon zombie with laser eyes..." className="w-full bg-[#050505] border border-gray-800 rounded-lg p-4 focus:border-cyan-500 outline-none text-sm text-white placeholder-gray-600 transition-all shadow-inner" />
              <button onClick={handleGenerate} disabled={isWorking} className="w-full bg-white hover:bg-gray-200 text-black font-black tracking-widest uppercase py-4 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 text-xs">
                {isWorking ? "PROCESSING..." : "EXECUTE GENERATION"}
              </button>
            </div>
          </div>
        </section>

        {/* RECENT DROPS / SHOWCASE */}
        <section id="gallery" className="w-full bg-[#0a0a0c] py-24 border-y border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">THE VAULT.</h2>
            <p className="text-gray-500 text-sm mb-12 max-w-2xl mx-auto">A glimpse into the metadata. These are examples of assets forged by our Neural Engine. No two outputs are ever exactly the same.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Fake Gallery Items to fill space */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-[#121215] rounded-xl border border-gray-800 flex flex-col items-center justify-center p-4 group hover:border-cyan-500/50 transition-colors">
                  <div className="w-full h-full bg-gray-900/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-gray-700 text-xs font-mono">ASSET_DATA_0{i}</span>
                  </div>
                  <div className="w-full flex justify-between items-center px-1">
                    <span className="text-[10px] text-gray-500 font-mono">#000{i}</span>
                    <span className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="w-full py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">ENGINE CAPABILITIES.</h2>
              <p className="text-gray-500">Built for collectors, founders, and digital anarchists.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon="🧬" title="100% Unique DNA" desc="Every prompt is processed through a randomized seed protocol. The asset you forge is entirely yours and will never be replicated by the engine again." />
              <FeatureCard icon="🎨" title="Strict Pixel Grid" desc="We don't do messy AI art. Our model uses a strict prompt-guard to force every generation into a flawless, cohesive 128x128 retro pixel aesthetic." />
              <FeatureCard icon="⚡" title="Mint-Ready Assets" desc="Download your files instantly. They are perfectly sized and formatted to be uploaded directly to IPFS, Thirdweb, or your preferred smart contract." />
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="w-full bg-[#0a0a0c] py-24 border-y border-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white">THE MANIFESTO.</h2>
            <div className="space-y-6 text-gray-400 leading-relaxed text-left md:text-center text-sm md:text-base">
              <p>
                In the early days of Web3, digital identity was dictated by the collections you could afford. If you couldn't afford a blue-chip PFP, you were sidelined. We built this Engine to shatter that barrier.
              </p>
              <p>
                This platform is a decentralized bridge between human imagination and machine execution. We trained a proprietary diffusion model exclusively on the retro, 8-bit, and 16-bit aesthetics that built the foundation of crypto culture. 
              </p>
              <p className="text-cyan-400 font-bold">
                You are no longer just a buyer. You are the creator, the artist, and the founder of your own digital identity.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="w-full py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-white text-center mb-12">SYSTEM LOGS (FAQ)</h2>
            <div className="space-y-4">
              <FAQItem q="Who owns the rights to the generated art?" a="You do. Once you execute the generation and download the asset, you hold full commercial and non-commercial rights to use it anywhere." />
              <FAQItem q="Can I mint these on a blockchain?" a="Absolutely. The engine generates high-fidelity PNGs that are perfect for minting on Ethereum, Base, Solana, or any network you choose." />
              <FAQItem q="How does the AI maintain the pixel style?" a="Our backend intercepts your prompt and automatically appends specific style modifiers, weights, and negative prompts before it reaches the diffusion model, guaranteeing the retro look." />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-10 border-t border-gray-900 bg-[#050505] text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-4 h-4 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-[4px]" />
            <span className="text-white font-black tracking-widest text-sm">NEXUS NODE</span>
          </div>
          <p className="text-gray-700 text-xs font-mono uppercase">© {new Date().getFullYear()} DECENTRALIZED ASSET FORGE. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-5 lg:px-10 border-b border-gray-900 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="font-black text-xl tracking-widest text-white flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-[6px] shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
        <span className="hidden sm:inline">NEXUS NODE</span>
      </div>
      <div className="flex gap-8 text-xs font-bold tracking-widest text-gray-500 uppercase">
        <a href="#gallery" className="hover:text-cyan-400 transition-colors">Vault</a>
        <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
        <a href="#about" className="hover:text-cyan-400 transition-colors">Manifesto</a>
        <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-colors group">
      <div className="w-12 h-12 bg-gray-900 border border-gray-800 text-xl rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-950/30 group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-6 bg-[#0a0a0c] rounded-xl border border-gray-800">
      <h4 className="text-white font-bold text-sm md:text-base mb-2">{q}</h4>
      <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{a}</p>
    </div>
  );
}