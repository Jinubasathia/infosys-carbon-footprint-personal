import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Leaf, ShieldCheck, Cpu, BarChart3, Lock, Users, ArrowRight, CheckCircle, Globe, Zap, AlertTriangle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-8 shadow-inner animate-pulse">
            <Leaf className="w-4 h-4" />
            <span>Enterprise Carbon Footprint Monitoring System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Track, Reduce & Neutralize Your <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Carbon Footprint</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A secure enterprise web platform enabling structured registration, government verification, admin-managed approvals, and intelligent carbon analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started & Register</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
            >
              <span>Portal Login</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</span>
              <span className="text-xs text-slate-400">BCrypt Security</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-teal-400">3NF</span>
              <span className="text-xs text-slate-400">Normalized Database</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-400">JWT</span>
              <span className="text-xs text-slate-400">Stateless Authentication</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400">24/7</span>
              <span className="text-xs text-slate-400">Admin Approval Workflow</span>
            </div>
          </div>

        </div>
      </section>

      {/* Problem Statement Section */}
      <section id="about" className="py-20 bg-slate-950 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Why Carbon Footprint Monitoring Matters</h3>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Industrialization and high digital energy consumption contribute significantly to greenhouse gas emissions. Unmonitored carbon footprint leads to environmental degradation. EcoTrack solves this by providing verified account access and real-time environmental tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Unverified Access Risks</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Legacy systems allow unverified user registrations resulting in spam data. EcoTrack enforces 3-step registration with government ID verification and Admin approval.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Security & Password Hygiene</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Passwords are encrypted using BCrypt. Temporary passwords issued upon approval require mandatory immediate reset upon first login (`firstLogin=true`).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/50 flex items-center justify-center text-teal-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Centralized Admin Control</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Admins receive comprehensive analytics, status distributions (Pending, Approved, Rejected), gender breakdown charts, and one-click credential dispatching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Enterprise Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Core Architectural Features</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">3-Section User Registration</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Collects Personal Details, Address Details, and Government Identity (Aadhaar, PAN, Passport, Driving License, Voter ID) with client and server validation.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">JWT & Role Based Access Control</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Spring Security 6 with JJWT 0.12.x ensures stateless, encrypted JWT authorization separating ADMIN and USER resource access.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">Automated Credentials Dispatch</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Upon Admin approval, system generates a unique username and secure temporary password, emailing credentials directly to the user.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">Interactive Admin Dashboard</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Live statistics cards, Recharts pie and bar graphs displaying total user metrics, gender demographic splits, and status breakdowns.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">PostgreSQL 3NF Schema</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fully normalized database design eliminating data redundancy with foreign key constraints, indexes, and JPA relationships.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">First-Login Password Reset</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Automated security check detects `firstLogin=true` and immediately redirects users to a secure password initialization flow.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">Ready to Experience EcoTrack?</h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
            Register your profile today or log in with your Admin credentials to explore the monitoring portal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
            >
              Start Registration
            </Link>
            <Link
              to="/admin/login"
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
