'use client';

export default function Navbar() {
  const showToast = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-6 right-6 z-[1000] p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white text-sm font-medium shadow-2xl neon-glow-blue scale-95 opacity-0 animate-slide-in animate-slide-out';
    toast.textContent = 'Login feature coming soon 👨‍⚕️';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove('opacity-0', 'scale-95'), 100);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'scale-95');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-b from-slate-900/80 to-transparent border-b border-white/5 supports-[backdrop-filter:blur()]:bg-slate-900/70">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Leukemia AI
        </div>
        <button 
          onClick={showToast}
          className="group relative px-6 py-3 bg-gradient-to-r from-transparent to-transparent bg-white/5 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 hover:bg-white/10 rounded-2xl text-white font-medium shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Login</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 -translate-x-full group-hover:translate-x-full" />
        </button>
      </div>
    </nav>
  );
}
