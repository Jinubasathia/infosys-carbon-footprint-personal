import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  User, Leaf, ShieldCheck, Zap, Car, Recycle, Award,
  LayoutDashboard, LogOut, AlertTriangle, Settings, FileText
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
      } catch {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const displayUser = profile || user;

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'reports', label: 'Reports', icon: FileText },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col min-h-screen sticky top-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-extrabold text-sm bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            EcoTrack
          </span>
        </div>

        {/* User badge */}
        <div className="px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
              {displayUser?.firstName?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white font-semibold truncate">{displayUser?.firstName} {displayUser?.lastName}</p>
              <p className="text-[10px] text-slate-500 truncate">@{displayUser?.username}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === key
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="h-14 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md">
          <h2 className="text-sm font-bold text-white">
            {sidebarItems.find((s) => s.key === activePage)?.label || 'Dashboard'}
          </h2>
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        </header>

        <main className="flex-1 px-6 py-6 space-y-6">

          {/* ── DASHBOARD PAGE ── */}
          {activePage === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-xl">
                    {displayUser?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">
                      Welcome back, {displayUser?.firstName}!
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                      <span className="text-emerald-400 font-mono">@{displayUser?.username}</span>
                      <span className="mx-2">•</span>
                      <span className="font-mono">{displayUser?.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Carbon Metrics */}
              <div>
                <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Carbon Footprint Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Energy Consumption', value: '2.4', unit: 'tCO2e/yr', desc: 'Electricity & heating footprint', icon: Zap, color: 'amber' },
                    { label: 'Transportation', value: '1.8', unit: 'tCO2e/yr', desc: 'Vehicle commute & transit impact', icon: Car, color: 'blue' },
                    { label: 'Waste & Recycling', value: '0.6', unit: 'tCO2e/yr', desc: 'Domestic waste diversion score', icon: Recycle, color: 'emerald' },
                    { label: 'Sustainability Rating', value: 'Grade A', unit: '', desc: 'Top 15% eco-efficient profile', icon: Award, color: 'teal' },
                  ].map(({ label, value, unit, desc, icon: Icon, color }) => (
                    <div key={label} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold">{label}</span>
                        <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 text-${color}-400 flex items-center justify-center`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="text-2xl font-extrabold text-white">
                        {value} {unit && <span className="text-xs text-slate-400 font-normal">{unit}</span>}
                      </span>
                      <p className="text-[11px] text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PROFILE PAGE ── */}
          {activePage === 'profile' && profile && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <User className="w-5 h-5 text-emerald-400" /> Account Profile Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Personal Summary</h4>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    {[
                      ['Full Name', `${profile.firstName} ${profile.middleName || ''} ${profile.lastName}`],
                      ['Gender & Age', `${profile.gender} • ${profile.age} yrs`],
                      ['Date of Birth', profile.dateOfBirth],
                      ['Mobile', profile.mobileNumber],
                      ['Email', profile.email],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between py-1 border-b border-slate-900 last:border-0">
                        <span className="text-slate-500">{label}</span>
                        <span className="text-white font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Address & Verification</h4>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                    {profile.address && (
                      <div>
                        <span className="text-slate-500 block mb-1">Residential Address</span>
                        <p className="text-slate-200 font-medium leading-relaxed">
                          {profile.address.houseNumber}, {profile.address.street}, {profile.address.area},{' '}
                          {profile.address.city}, {profile.address.state} -{' '}
                          <span className="text-emerald-400 font-mono">{profile.address.pinCode}</span>
                        </p>
                      </div>
                    )}
                    {profile.governmentId && (
                      <div className="pt-2 border-t border-slate-900">
                        <span className="text-slate-500 block mb-1">Government ID</span>
                        <span className="text-white font-bold">{profile.governmentId.idType}</span>
                        {profile.governmentId.documentUrl && (
                          <a
                            href={`http://localhost:8080${profile.governmentId.documentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-1 text-emerald-400 hover:underline text-[11px]"
                          >
                            View Uploaded Document ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTS PAGE ── */}
          {activePage === 'reports' && (
            <div className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-64">
              <FileText className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-bold text-white">Reports Coming Soon</h3>
              <p className="text-xs text-slate-400">Carbon footprint reports and analytics will be available in the next milestone.</p>
            </div>
          )}

          {/* ── SETTINGS PAGE ── */}
          {activePage === 'settings' && (
            <div className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-64">
              <Settings className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-bold text-white">Settings Coming Soon</h3>
              <p className="text-xs text-slate-400">Account settings and preferences will be available in the next milestone.</p>
            </div>
          )}

        </main>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Confirm Logout</h3>
                <p className="text-xs text-slate-400">Are you sure you want to log out?</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700">Cancel</button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
