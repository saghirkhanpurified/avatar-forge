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
    } catch (err) { setError("Download blocked. Right-click and 'Save Image As'."); }
  };

  const isWorking = isGenerating || (imgUrl !== "" && !isLoaded);

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50 text-slate-700 font-sans selection:bg-violet-200 overflow-x-hidden flex flex-col relative">
      <NavBar />

      {/* RESTORED: Background Decals */}
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
              <a href="#about" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors border-b-2 border-slate-300 hover:border-violet-600 pb-1">
                Read our story
              </a>
              <span className="text-slate-300 hidden sm:block">|</span>
              <a href="#guides" className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors border-b-2 border-transparent hover:border-violet-600 pb-1">
                Design Guides
              </a>
            </div>
          </div>

          <div className="w-full max-w-[440px] flex flex-col items-center">
            {/* GENERATOR CARD - Speed Optimized */}
            <div className="w-full bg-white p-4 sm:p-6 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200 relative mb-6">
              <div className="relative mb-5 sm:mb-6 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
                {isWorking && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-50/90 z-20">
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
                  </div>
                )}

                {imgUrl && (
                  <div className={`absolute inset-0 z-30 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
                    <img src={imgUrl} alt="AI Generated Pixel Art" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
                    {isLoaded && !isWorking && (
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent pt-20">
                        <button onClick={handleDownload} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black tracking-widest uppercase py-3 sm:py-3.5 rounded-xl transition-all active:scale-[0.98] text-[10px] sm:text-xs shadow-xl flex items-center justify-center gap-2">
                          DOWNLOAD IMAGE
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isWorking} placeholder="e.g. A cyberpunk hacker..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 outline-none text-sm text-slate-900 placeholder-slate-500 focus:ring-4 focus:ring-violet-500/10 transition-all" />
                <button onClick={handleGenerate} disabled={isWorking} className="w-full font-black tracking-widest uppercase py-3.5 sm:py-4 rounded-xl shadow-lg bg-slate-900 hover:bg-black text-white disabled:opacity-50 transition-all">
                  {isWorking ? "FORGING..." : "CREATE AVATAR"}
                </button>
              </div>
            </div>

            {/* A-ADS - Fixed height for CLS */}
            <div className="w-full min-h-[114px] bg-white rounded-[20px] border border-slate-200 shadow-sm flex items-center justify-center p-3">
               <iframe data-aa='2435461' src='//acceptable.a-ads.com/2435461/?size=Adaptive' style={{ border: 0, padding: 0, width: '100%', height: '90px', overflow: 'hidden' }} title="Ad"></iframe>
            </div>
          </div>
        </section>

        {/* RESTORED: Full Vault Section with Priority Images */}
        <section id="gallery" className="scroll-mt-32 w-full bg-white py-16 sm:py-24 border-y border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">The Vault.</h2>
            <p className="text-slate-600 text-sm sm:text-base mb-12 sm:mb-16 max-w-2xl mx-auto leading-relaxed">
              Check out some recent creations! These custom 16-bit sprites show the power of our AI pixel art engine.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {vaultItems.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-3 group hover:border-violet-300 transition-all shadow-sm">
                  <div className="relative aspect-square bg-slate-200/50 rounded-xl mb-3 overflow-hidden">
                    <Image 
                      src={item.src} 
                      alt={`${item.prompt} - AI Pixel Art`} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                      style={{ imageRendering: "pixelated" }}
                      priority={i < 2}
                    />
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest text-center">"{item.prompt}"</p>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center px-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">#{item.id}</span>
                    <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-violet-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESTORED: Full Features Section */}
        <section id="features" className="scroll-mt-32 w-full py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-12 sm:mb-16 uppercase">Why Forge With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon="🎨" title="Always Unique" desc="Every image is drawn from scratch. You will never get the exact same result twice, making your art truly one-of-a-kind." />
              <FeatureCard icon="👾" title="Cool Pixel Style" desc="We trained our AI on classic video game aesthetics. No messy drawings—just clean, retro vibes." />
              <FeatureCard icon="🚀" title="Yours to Mint" desc="Download instantly. You own the picture completely and can take it to mint on any blockchain platform." />
            </div>
          </div>
        </section>

        {/* RESTORED: Full About Section */}
        <section id="about" className="scroll-mt-32 w-full bg-white py-16 sm:py-24 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase">Who We Are.</h2>
            <div className="w-16 h-1 bg-violet-600 mx-auto rounded-full"></div>
            <p className="text-slate-600 leading-loose text-sm sm:text-lg">
              We are a group of friends who love Web3 and NFTs. We built The Avatar Forge to make cool art accessible to everyone. Try making your own custom character today!
            </p>
          </div>
        </section>

        {/* RESTORED: Detailed FAQ */}
        <section id="faq" className="scroll-mt-32 w-full py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-12 uppercase">Common Questions</h2>
            <div className="space-y-4 text-left">
              <FAQItem q="Is it really free?" a="Yes! You can create awesome avatars completely free of charge." />
              <FAQItem q="Do I own the art?" a="Yes. Once you download the image, it is 100% yours to do whatever you want with it." />
              <FAQItem q="Can I mint this as an NFT?" a="Yes! We give you a high-quality file. You can take that and mint it on Ethereum, Solana, or any other network." />
            </div>
          </div>
        </section>

        {/* RESTORED: Full SEO Content Wall */}
        <section className="scroll-mt-32 w-full bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-left space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">The Best Free AI Pixel Art Generator for Web3 and Gaming</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-loose">
              Welcome to <strong>The Avatar Forge</strong>, the internet's premier tool for creating custom, one-of-a-kind 16-bit avatars. Whether you're an indie game developer in need of retro RPG assets or a Web3 enthusiast crafting a unique digital identity, our AI-powered pixel art engine delivers results in seconds.
            </p>
          </div>
        </section>

        {/* RESTORED: Detailed Guides */}
        <section id="guides" className="scroll-mt-32 w-full bg-white py-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 uppercase">Pixel Art Design Guides</h2>
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-violet-600">How to Create 16-Bit RPG Assets for Free</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Creating assets for an indie game usually takes weeks. With <strong>The Avatar Forge</strong>, you can generate a full cast of characters in minutes. To get that classic Super Nintendo (SNES) look, use prompts that specify a "limited color palette" and "flat shading." Our AI understands retro console limitations, ensuring your sprites fit perfectly into engines like Unity or Godot.
                </p>
              </div>
              <div className="space-y-4 border-t border-slate-100 pt-8">
                <h3 className="text-xl font-bold text-violet-600">Optimizing AI Pixel Art for Discord and Web3</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  When using AI-generated pixel art for Discord or as an NFT, resolution matters. While our engine provides high-fidelity renders, we recommend using a "nearest neighbor" scaling method if you enlarge your images. This keeps edges sharp and prevents the blurring that happens with standard upscalers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full py-12 border-t border-slate-200 bg-slate-50 text-center">
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} THE AVATAR FORGE. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </main>
  );
}

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-5 lg:px-10 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="font-black text-base lg:text-xl tracking-widest text-slate-900 flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-[6px] shadow-sm" />
        <span className="uppercase">The Avatar Forge</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        <a href="#gallery" className="hover:text-violet-600 transition-colors">Vault</a>
        <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
        <a href="#about" className="hover:text-violet-600 transition-colors">About</a>
        <a href="#guides" className="hover:text-violet-600 transition-colors">Guides</a>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-violet-300 transition-all shadow-sm flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-slate-50 text-3xl rounded-2xl flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors">
      <h4 className="text-slate-900 font-bold text-sm sm:text-lg mb-3 uppercase tracking-tight">{q}</h4>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{a}</p>
    </div>
  );
}