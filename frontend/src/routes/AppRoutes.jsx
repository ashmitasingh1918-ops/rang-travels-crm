import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Placeholder Pages for Team Startup
const Login = () => (
  <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome back</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
          <input type="email" placeholder="admin@rangtravels.com" disabled className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
          <input type="password" value="••••••••" disabled className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none" />
        </div>
        <button 
          onClick={() => {
            localStorage.setItem('access_token', 'stub_access_token');
            localStorage.setItem('refresh_token', 'stub_refresh_token');
            window.location.reload();
          }} 
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-semibold rounded-lg text-sm transition shadow-lg tracking-wide mt-2"
        >
          Developer Quick Login
        </button>
      </div>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
    <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard Roster</h1>
        <p className="text-slate-400 text-sm mt-1">Status of modules and real-time CRM indices for Rang Travels</p>
      </div>
      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition">Logout</button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Leads</h3>
        <p className="text-4xl font-extrabold text-teal-400">42</p>
        <span className="text-xs text-slate-500 font-medium">8 added this week</span>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Booked Tours</h3>
        <p className="text-4xl font-extrabold text-indigo-400">18</p>
        <span className="text-xs text-slate-500 font-medium">12 upcoming this month</span>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Revenues Generated</h3>
        <p className="text-4xl font-extrabold text-white">$14,820</p>
        <span className="text-xs text-green-400 font-semibold">↑ 18% over last quarter</span>
      </div>
    </div>
  </div>
);

const ModuleStub = ({ name }) => (
  <div className="p-8 max-w-7xl mx-auto w-full">
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4 shadow-xl">
      <div className="w-16 h-16 rounded-full bg-slate-800 text-indigo-400/80 flex items-center justify-center font-bold text-2xl mx-auto border border-slate-700/50">M</div>
      <h1 className="text-2xl font-bold text-white">{name} Module</h1>
      <p className="text-slate-400 text-sm max-w-md mx-auto">This boilerplate page is ready for feature development. You can modify state handling in services and store files under src/.</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<ModuleStub name="Unauthorized Access" />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<ModuleStub name="Leads" />} />
        <Route path="/clients" element={<ModuleStub name="Clients" />} />
        <Route path="/tours" element={<ModuleStub name="Tours" />} />
        <Route path="/quotations" element={<ModuleStub name="Quotations" />} />
        <Route path="/hotels" element={<ModuleStub name="Hotels" />} />
        <Route path="/cities" element={<ModuleStub name="Cities" />} />
        <Route path="/agents" element={<ModuleStub name="Agents" />} />
        <Route path="/payments" element={<ModuleStub name="Payments" />} />
        <Route path="/email" element={<ModuleStub name="Emails" />} />
        
        <Route element={<AdminRoute />}>
          <Route path="/reports" element={<ModuleStub name="Reports" />} />
          <Route path="/settings" element={<ModuleStub name="Settings" />} />
          <Route path="/staff" element={<ModuleStub name="Staff" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
