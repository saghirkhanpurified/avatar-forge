export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 font-sans text-slate-700">
      <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase">Privacy Policy</h1>
      <p className="mb-4">Your privacy matters. Here is how we handle data:</p>
      <h2 className="text-xl font-bold mt-8 mb-4">1. Data Collection</h2>
      <p>We do not store your prompts or generated images on our servers. All generation is processed via AI and delivered to your browser.</p>
      <h2 className="text-xl font-bold mt-8 mb-4">2. Cookies</h2>
      <p>We use standard analytics tools to improve the site experience.</p>
      <a href="/" className="inline-block mt-12 text-violet-600 font-bold underline">Back to Forge</a>
    </div>
  );
}