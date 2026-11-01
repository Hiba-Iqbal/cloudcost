import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">

      {/* Main navigation header */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-200">
        <div className="text-xl font-bold text-brand-primary flex items-center gap-2">
          <span>☁️</span> CloudCost Ledger
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-brand-primary hover:bg-brand-hover text-white text-sm font-medium py-2 px-4 rounded-lg transition-all shadow-sm"
          >
            Sign Up free
          </Link>
        </div>
      </header>

      {/* Hero presentation layout */}
      <main className="max-w-4xl mx-auto text-center px-6 py-24 mt-10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-brand-primary bg-clip-text text-transparent">
          Stop Bleeding Cash on Forgotten Cloud Servers
        </h1>

        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Modern software teams turn on temporary cloud resources and forget to turn them off. CloudCost securely hooks into your infrastructure to uncover billing leaks instantly.
        </p>

        {/* Primary Call to Action */}
        <div>
          <Link 
            href="/register" 
            className="bg-brand-primary hover:bg-brand-hover text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-md inline-block text-lg hover:scale-[1.02]"
          >
            Start Tracking Cloud Waste ➡️
          </Link>
        </div>
      </main>

    </div>
  );
}
