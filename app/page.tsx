"use client";

import { useState, useEffect } from "react";

const LOADING_MSGS = ["Starting the drawing...", "Adding colors...", "Making it pixel perfect...", "Finishing up..."];
const MAX_DAILY_GENS = 3;

// UPDATED: The Vault now has your new premium prompts!
const vaultItems = [
  { id: "084", src: "/vault-1.png", prompt: "A cyberpunk hacker in a dark hoodie with glowing neon green glasses" },
  { id: "085", src: "/vault-2.png", prompt: "A fiery knight wearing heavy golden armor with glowing red eyes" },
  { id: "086", src: "/vault-3.png", prompt: "A cool ape wearing a golden crown and dark sunglasses" },
  { id: "087", src: "/vault-4.png", prompt: "An alien astronaut in a sleek white spacesuit with a purple visor" }
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState(""); 
  const [error, setError] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  
  const [gensLeft, setGensLeft] = useState(MAX_DAILY_GENS);
  const [isLimitChecked, setIsLimitChecked] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("forge_date");
    const storedGens = localStorage.getItem("forge_gens");

    if (storedDate === today && storedGens !== null) {
      setGensLeft(parseInt(storedGens));
    } else {
      localStorage.setItem("forge_date", today);
      localStorage.setItem("forge_gens", MAX_DAILY_GENS.toString());
      setGensLeft(MAX_DAILY_GENS);
    }
    setIsLimitChecked(true);
  }, []);

  useEffect(() => {
    const int = isGenerating ? setInterval(() => setLoadStep(p => (p + 1) % 4), 2500) : undefined;
    if (!isGenerating) setLoadStep(0);
    return () => clearInterval(int);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) return setError("Please type what you want us to draw.");
    if (gensLeft <= 0) return setError("You've used your 3 free creations for today. Come back tomorrow!");
    
    setIsGenerating(true); setIsLoaded(false); setError(""); setImgUrl(""); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }), 
      });
      if (!res.ok) throw new Error("Servers are busy. Please try again.");
      
      const data = await res.json();
      setImgUrl(data.imageUrl); 
      
      const newCount = gensLeft - 1;
      setGensLeft(newCount);
      localStorage.setItem("forge_gens", newCount.toString());

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
    } catch (err) {
      setError("Download blocked. Right-click and 'Save Image As'.");
    }
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);
  const outOfGens = gensLeft <= 0;

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50 text-slate-600 font-sans selection:bg-violet-200 overflow-x-hidden flex flex-col relative">
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
              Type what you want to see, and our AI will draw a completely unique pixel art character for you. It's 100% free to use, and you own the image to mint wherever you want later.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#about" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors border-b-2 border-slate-200 hover:border-violet-600 pb-1">
                Read our story
              </a>
            </div>
          </div>

          <div className="w-full max-w-[440px] flex flex-col items-center">
            {/* GENERATOR CARD */}
            <div className="w-full bg-white p-4 sm:p-6 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200 relative mb-6">
              <div className="relative mb-5 sm:mb-6 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
                
                {isWorking && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-50 z-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
                    <p className="text-violet-600 font-bold text-[10px] sm:text-xs tracking-widest uppercase animate-pulse">
                      {isGenerating ? LOADING_MSGS[loadStep] : "Getting your image..."}
                    </p>
                  </div>
                )}

                {!imgUrl && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50 z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <p className="text-slate-500 font-bold text-xs sm:text-sm tracking-widest uppercase">Ready to create</p>
                    <p className="text-slate-400 text-[10px] sm:text-[11px] mt-2 text-center">Tell us what to draw below.</p>
                  </div>
                )}

                {imgUrl && (
                  <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${isLoaded && !isWorking ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <img src={imgUrl} alt="Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                    {isLoaded && !isWorking && (
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent pt-20">
                        <button onClick={handleDownload} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black tracking-widest uppercase py-3 sm:py-3.5 rounded-xl transition-all active:scale-[0.98] text-[10px] sm:text-xs shadow-xl flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          DOWNLOAD IMAGE
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 mb-4 text-center text-[10px] sm:text-[11px] uppercase tracking-wider font-bold bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

              <div className="space-y-3 sm:space-y-4 relative z-10">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={outOfGens || isWorking} placeholder="e.g. A cyberpunk hacker, A fantasy warrior..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none text-sm text-slate-900 placeholder-slate-400 transition-all shadow-inner disabled:opacity-50" />
                <button 
                  onClick={handleGenerate} 
                  disabled={isWorking || outOfGens || !isLimitChecked} 
                  className={`w-full font-black tracking-widest uppercase py-3.5 sm:py-4 rounded-xl transition-all active:scale-[0.98] text-[10px] sm:text-xs shadow-lg ${outOfGens ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' : 'bg-slate-900 hover:bg-black text-white disabled:opacity-50'}`}
                >
                  {isWorking ? "DRAWING NOW..." : outOfGens ? "DAILY LIMIT REACHED" : `CREATE AVATAR (${gensLeft} LEFT)`}
                </button>
              </div>
            </div>

            {/* A-ADS BANNER */}
            <div className="w-full bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center p-3" style={{ minHeight: '100px' }}>
              <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
                <iframe 
                  data-aa='2435461' 
                  src='//acceptable.a-ads.com/2435461/?size=Adaptive'
                  style={{ border: 0, padding: 0, width: '100%', height: '90px', overflow: 'hidden', display: 'block', margin: 'auto' }}
                  title="A-ADS Banner"
                ></iframe>
              </div>
            </div>

          </div>
        </section>

        {/* VAULT SECTION */}
        <section id="gallery" className="scroll-mt-32 w-full bg-white py-16 sm:py-24 border-y border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight">THE VAULT.</h2>
            <div className="max-w-3xl mx-auto space-y-4 mb-10 sm:mb-16">
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Check out some recent creations! Because of how our AI works, no two images will ever look exactly the same, even if you type the exact same words.
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

        {/* FEATURES SECTION */}
        <section id="features" className="scroll-mt-32 w-full py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-10 sm:mb-16">WHY USE OUR TOOL?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard icon="🎨" title="Always Unique" desc="Every image is drawn from scratch by the AI. You will never get the exact same result twice, making your art truly one-of-a-kind." />
              <FeatureCard icon="👾" title="Cool Pixel Style" desc="We trained our AI to only make awesome retro pixel art. No weird shapes or messy drawings—just clean, classic video game vibes." />
              <FeatureCard icon="🚀" title="Yours to Mint" desc="Download your image instantly. You own the picture completely and can take it to mint on any blockchain platform you choose." />
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="scroll-mt-32 w-full bg-white py-16 sm:py-24 border-y border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 sm:space-y-10">
            <div className="text-center">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 sm:mb-6">WHO WE ARE.</h2>
              <div className="w-16 sm:w-24 h-1 bg-violet-600 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6 sm:space-y-8 text-slate-600 leading-loose text-sm sm:text-lg text-left md:text-center">
              <p>
                We are a group of friends who love Web3 and NFTs. But as we spent time in these communities, we noticed a big problem: getting good art for your profile picture is either way too expensive, or you have to wait weeks for an artist to draw it.
              </p>
              <div className="bg-slate-50 border-l-4 border-violet-600 p-6 sm:p-8 rounded-r-2xl shadow-sm my-6 sm:my-8 text-left">
                <p className="text-slate-900 font-bold text-lg sm:text-xl italic">"We built The Avatar Forge to fix this problem and make cool art accessible to everyone."</p>
              </div>
              <p>
                We want everyone to have awesome, unique digital art without having to pay crazy prices. Our tool is free, super easy to use, and open to anyone who wants to create something cool. Try making your own custom character today!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="scroll-mt-32 w-full py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-12">COMMON QUESTIONS</h2>
            <div className="space-y-4 sm:space-y-6 text-left">
              <FAQItem q="Is it really free?" a="Yes! You can create up to 3 awesome avatars every single day completely free of charge." />
              <FAQItem q="Do I own the art?" a="Yes. Once you download the image, it is 100% yours to do whatever you want with it." />
              <FAQItem q="Can I mint this as an NFT?" a="Yes! We give you a high-quality picture file. You can take that file and mint it on Ethereum, Solana, Base, or any other network all by yourself." />
              <FAQItem q="Do I need a crypto wallet to use this website?" a="Nope! You don't need MetaMask or any other wallet to create the art. Just type what you want and click download." />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-10 sm:py-12 border-t border-slate-200 bg-slate-50 text-center px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
            <div className="w-5 h-5 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-[6px]" />
            <span className="text-slate-900 font-black tracking-widest text-sm sm:text-base">THE AVATAR FORGE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-400 mb-6">
            <a href="#terminal" className="hover:text-violet-600 transition-colors">Generator</a>
            <a href="#about" className="hover:text-violet-600 transition-colors">About Us</a>
            <a href="#faq" className="hover:text-violet-600 transition-colors">FAQ</a>
            {/* UPDATED: Twitter Link in Footer */}
            <a href="https://x.com/SaghirWeb3" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Twitter (X)</a>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
            © {new Date().getFullYear()} THE AVATAR FORGE. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 sm:p-5 lg:px-10 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">
      <div className="font-black text-sm sm:text-base lg:text-xl tracking-widest text-slate-900 flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-[6px] shadow-sm shrink-0" />
        <span className="shrink-0">THE AVATAR FORGE</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-slate-500 uppercase">
        <a href="#gallery" className="hover:text-violet-600 transition-colors">Vault</a>
        <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
        <a href="#about" className="hover:text-violet-600 transition-colors">About</a>
        <a href="#faq" className="hover:text-violet-600 transition-colors">FAQ</a>
        {/* UPDATED: X/Twitter Icon in Navbar */}
        <a href="https://x.com/YourHandle" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
      <a href="#terminal" className="md:hidden text-[10px] font-black tracking-widest bg-violet-100 text-violet-700 px-3 py-2 rounded-lg border border-violet-200 uppercase shrink-0">
        CREATE
      </a>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-violet-300 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col items-center text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 border border-slate-200 text-2xl sm:text-3xl rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-violet-50 group-hover:border-violet-200 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-4">{title}</h3>
      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-5 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="text-slate-900 font-bold text-sm sm:text-lg mb-2 sm:mb-3">{q}</h4>
      <p className="text-slate-600 text-xs sm:text-base leading-relaxed">{a}</p>
    </div>
  );
}