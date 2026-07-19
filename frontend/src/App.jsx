import React from 'react';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg">R</div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Rang Travels CRM</span>
        </div>
        <nav className="flex gap-4 text-xs font-semibold text-slate-400">
          <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700/50 text-indigo-400">v1.0.0 Stable</span>
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
