"use client";

import { useState, useEffect } from "react";

const LOADING_MSGS = ["Connecting to Node...", "Compiling Trait DNA...", "Rendering Pixel Grid...", "Minting Asset..."];

const vaultItems = [
  { id: "084", src: "/vault-1.png", prompt: "sad hero" },
  { id: "085", src: "/vault-2.png", prompt: "sad hero" },
  { id: "086", src: "/vault-3.png", prompt: "sad hero" },
  { id: "087", src: "/vault-4.png", prompt: "sad hero" }
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
      link.download = `avatar-forge-asset-${Date.now()}.png`;
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
    <main className="min-h-[100dvh] w-full bg-slate-50 text-slate-600 font-sans selection:bg-violet-200 overflow-x-hidden flex flex-col relative">
      <NavBar />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-400/10 blur-[100px] sm:blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-violet-400/10 blur-[100px] sm:blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section id="terminal" className="scroll-mt-28 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-24 pb-20 flex flex-col lg:flex-row items-center gap-10 sm:gap-16 min-h-[85vh]">
          
          <div className="flex-1 text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
              Avatar Forge Live
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05]">
              CREATE YOUR <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">1-OF-1 ASSET.</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Stop settling for generic profile pictures and expensive secondary markets. Avatar Forge is the ultimate AI-powered creation terminal. Input your exact vision, and our neural engine will instantly generate a pristine, mint-ready retro avatar directly to your hard drive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#about" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors border-b-2 border-slate-200 hover:border-violet-600 pb-1">
                Read the Complete Manifesto
              </a>
            </div>
          </div>

          <div className="w-full max-w-[440px] bg-white p-4 sm:p-6 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200 relative">
            <div className="relative mb-5 sm:mb-6 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
              
              {isWorking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-50 z-20">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
                  <p className="text-violet-600 font-bold text-[10px] sm:text-xs tracking-widest uppercase animate-pulse">
                    {isGenerating ? LOADING_MSGS[loadStep] : "Extracting Image Data..."}
                  </p>
                </div>
              )}

              {!imgUrl && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50 z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  </div>
                  <p className="text-slate-500 font-bold text-xs sm:text-sm tracking-widest uppercase">System Ready</p>
                  <p className="text-slate-400 text-[10px] sm:text-[11px] mt-2">Awaiting prompt parameters.</p>
                </div>
              )}

              {imgUrl && (
                <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${isLoaded && !isWorking ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <img src={imgUrl} alt="Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                  {isLoaded && !isWorking && (
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent pt-20">
                      <button onClick={handleDownload} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black tracking-widest uppercase py-3 sm:py-3.5 rounded-xl transition-all active:scale-[0.98] text-[10px] sm:text-xs shadow-xl flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        SECURE ASSET
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <p className="text-red-500 mb-4 text-center text-[10px] sm:text-[11px] uppercase tracking-wider font-bold bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

            <div className="space-y-3 sm:space-y-4 relative z-10">
              <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. A neon zombie..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none text-sm text-slate-900 placeholder-slate-400 transition-all shadow-inner" />
              <button onClick={handleGenerate} disabled={isWorking} className="w-full bg-slate-900 hover:bg-black text-white font-black tracking-widest uppercase py-3.5 sm:py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 text-[10px] sm:text-xs shadow-lg">
                {isWorking ? "PROCESSING..." : "EXECUTE GENERATION"}
              </button>
            </div>
          </div>
        </section>

        {/* RECENT DROPS / SHOWCASE */}
        <section id="gallery" className="scroll-mt-24 w-full bg-white py-16 sm:py-24 border-y border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight">THE VAULT.</h2>
            <div className="max-w-3xl mx-auto space-y-4 mb-10 sm:mb-16">
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Take a glimpse into the metadata. The Vault displays pure, unedited examples of assets forged directly by our Neural Engine. Notice how the same prompt generates entirely unique DNA every single time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {vaultItems.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-3 group hover:border-violet-300 transition-colors shadow-sm">
                  <div className="w-full aspect-square bg-slate-200/50 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                    <img src={item.src} alt={item.prompt} className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <p className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center">
                        PROMPT:<br/>"{item.prompt}"
                      </p>
                    </div>
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

        {/* DETAILED TECH / CAPABILITIES SECTION */}
        <section id="features" className="scroll-mt-24 w-full py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6">ENGINE CAPABILITIES.</h2>
              <p className="text-slate-500 text-sm sm:text-lg leading-relaxed">
                Avatar Forge isn't a basic filter. It is a highly optimized pipeline built exclusively for rendering high-fidelity pixel art.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard icon="🧬" title="100% Unique DNA Generation" desc="Every prompt is processed through a complex seed protocol before hitting the neural network. This ensures the asset you forge is entirely yours and cannot be replicated." />
              <FeatureCard icon="🎨" title="Strict Pixel Grid Enforcement" desc="Our backend architecture intercepts your prompt and applies aggressive style modifiers, forcing the model into a flawless, cohesive 128x128 retro grid aesthetic." />
              <FeatureCard icon="⚡" title="Instant Mint-Ready Assets" desc="You download your files instantly, perfectly sized, formatted, and optimized to be uploaded directly to IPFS or embedded into your preferred smart contract." />
            </div>
          </div>
        </section>

        {/* MASSIVE MANIFESTO SECTION */}
        <section id="about" className="scroll-mt-24 w-full bg-white py-16 sm:py-24 border-y border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
            <div className="text-center">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 sm:mb-6">THE MANIFESTO.</h2>
              <div className="w-16 sm:w-24 h-1 bg-violet-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-6 sm:space-y-8 text-slate-600 leading-loose text-sm sm:text-lg">
              <p>
                In the early days of Web3, your identity was dictated entirely by the collections you could afford. If you couldn't afford a blue-chip profile picture, you were effectively sidelined. We built Avatar Forge to shatter that barrier.
              </p>
              <p>
                We believe premium digital identity is a right, not a luxury. Avatar Forge acts as a decentralized bridge between human imagination and raw machine execution. We connected directly to a fine-tuned diffusion model trained exclusively on the retro aesthetics that built the foundation of crypto culture.
              </p>
              <div className="bg-slate-50 border-l-4 border-violet-600 p-6 sm:p-8 rounded-r-2xl shadow-sm my-6 sm:my-8">
                <p className="text-slate-900 font-bold text-lg sm:text-xl italic leading-relaxed">
                  "You are no longer just a buyer or a spectator. Through Avatar Forge, you become the creator, the artist, and the sole founder of your own digital identity."
                </p>
              </div>
              <p>
                Whether you are a developer looking for rapid prototyping assets, a community manager looking to outfit your Discord server, or simply a collector who wants a truly 1-of-1 piece of art, Avatar Forge gives you the tools to command the machine. Welcome to the new standard.
              </p>
            </div>
          </div>
        </section>

        {/* EXPANDED FAQ SECTION */}
        <section id="faq" className="scroll-mt-24 w-full py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">SYSTEM LOGS & FAQ</h2>
              <p className="text-slate-500 text-sm sm:text-lg">Everything you need to know about the Forge.</p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <FAQItem q="Who owns the commercial rights to the generated art?" a="You do. Once you execute the generation protocol and download the asset, you hold full commercial and non-commercial rights." />
              <FAQItem q="Can I mint these images directly onto a blockchain?" a="Absolutely. The files we generate are high-fidelity, standardized PNGs. They are optimized to be uploaded to IPFS and minted on Ethereum, Solana, Base, or any platform." />
              <FAQItem q="How exactly does the AI maintain the strict pixel art style?" a="Our server intercepts your text and wraps it in a complex array of positive modifiers, negative weights, and structural prompt-guards before it reaches the AI." />
              <FAQItem q="Will the system ever generate the same image twice?" a="No. Even if two users type the exact same prompt at the exact same time, the backend injects a randomly generated noise seed into the computation to guarantee unique DNA." />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-10 sm:py-12 border-t border-slate-200 bg-slate-50 text-center px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-[6px] shadow-sm" />
            <span className="text-slate-900 font-black tracking-widest text-sm sm:text-base">AVATAR FORGE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-400 mb-6">
            <a href="#terminal" className="hover:text-violet-600 transition-colors">Generator</a>
            <a href="#gallery" className="hover:text-violet-600 transition-colors">Vault</a>
            <a href="#about" className="hover:text-violet-600 transition-colors">Manifesto</a>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
            © {new Date().getFullYear()} AVATAR FORGE TECHNOLOGIES. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 sm:p-5 lg:px-10 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm">
      <div className="font-black text-lg sm:text-xl tracking-widest text-slate-900 flex items-center gap-2 sm:gap-3">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-[6px] shadow-sm" />
        <span className="hidden sm:inline">AVATAR FORGE</span>
      </div>
      <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest text-slate-500 uppercase">
        <a href="#gallery" className="hover:text-violet-600 transition-colors">Vault</a>
        <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
        <a href="#about" className="hover:text-violet-600 transition-colors">Manifesto</a>
        <a href="#faq" className="hover:text-violet-600 transition-colors">FAQ</a>
      </div>
      <a href="#terminal" className="md:hidden text-[10px] sm:text-xs font-black tracking-widest bg-violet-100 text-violet-700 px-3 sm:px-4 py-2 rounded-lg border border-violet-200">
        START FORGING
      </a>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-violet-300 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col items-center text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 border border-slate-200 text-2xl sm:text-3xl rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-4">{title}</h3>
      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-5 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors">
      <h4 className="text-slate-900 font-bold text-sm sm:text-lg mb-2 sm:mb-3">{q}</h4>
      <p className="text-slate-600 text-xs sm:text-base leading-relaxed">{a}</p>
    </div>
  );
}