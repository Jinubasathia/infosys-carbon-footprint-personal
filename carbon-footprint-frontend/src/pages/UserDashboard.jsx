import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Leaf, ShieldCheck, MapPin, Zap, Car, Recycle, Award, Mail, Phone, Calendar } from 'lucide-react';

const UserDashboard = () => {
  const { user, showToast } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
      } catch (err) {
        showToast('Failed to load user profile details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayUser = profile || user;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-xl shadow-emerald-900/30">
                {displayUser?.firstName?.[0] || 'U'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {displayUser?.firstName} {displayUser?.lastName}!
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center gap-2">
                  <span>Username: <strong className="text-emerald-400 font-mono">@{displayUser?.username}</strong></span>
                  <span>•</span>
                  <span>Email: <strong className="text-slate-300 font-mono">{displayUser?.email}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account Verified & Approved
              </span>
            </div>
          </div>
        </div>

        {/* Foundation Carbon Tracking Metrics */}
        <div>
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Carbon Footprint Metrics Foundation</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Energy Consumption</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-white">2.4 <span className="text-xs text-slate-400 font-normal">tCO2e/yr</span></span>
              <p className="text-[11px] text-slate-400">Electricity & heating footprint index</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Transportation</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-white">1.8 <span className="text-xs text-slate-400 font-normal">tCO2e/yr</span></span>
              <p className="text-[11px] text-slate-400">Vehicle commute & transit impact</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Waste & Recycling</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Recycle className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-white">0.6 <span className="text-xs text-slate-400 font-normal">tCO2e/yr</span></span>
              <p className="text-[11px] text-slate-400">Domestic waste diversion score</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Sustainability Rating</span>
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400">Grade A</span>
              <p className="text-[11px] text-slate-400">Top 15% eco-efficient profile</p>
            </div>

          </div>
        </div>

        {/* User Detailed Profile Information Card */}
        {profile && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-5 h-5 text-emerald-400" /> Account Profile Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              
              {/* Personal Column */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Personal Summary</h4>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Full Name</span>
                    <span className="text-white font-medium">{profile.firstName} {profile.middleName || ''} {profile.lastName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Gender & Age</span>
                    <span className="text-white font-medium">{profile.gender} • {profile.age} yrs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Date of Birth</span>
                    <span className="text-white font-medium">{profile.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Contact Number</span>
                    <span className="text-emerald-400 font-mono font-medium">{profile.mobileNumber}</span>
                  </div>
                </div>
              </div>

              {/* Address & Government Identity Column */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Address & Government Verification</h4>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                  {profile.address && (
                    <div>
                      <span className="text-slate-500 block mb-1">Residential Address</span>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {profile.address.houseNumber}, {profile.address.street}, {profile.address.area}, {profile.address.city}, {profile.address.state} - <span className="text-emerald-400 font-mono">{profile.address.pinCode}</span>
                      </p>
                    </div>
                  )}

                  {profile.governmentId && (
                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                      <div>
                        <span className="text-slate-500 block">Verified ID Type</span>
                        <span className="text-white font-bold">{profile.governmentId.idType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-right">Document Number</span>
                        <span className="text-emerald-400 font-mono font-bold">{profile.governmentId.idNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
