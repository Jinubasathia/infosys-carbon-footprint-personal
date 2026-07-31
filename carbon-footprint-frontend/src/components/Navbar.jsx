import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogOut, Shield, User, UserPlus, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                EcoTrack
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Infosys Milestone 1
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-emerald-400 ${
                isActive('/') ? 'text-emerald-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Home
            </Link>
            <a href="#about" className="text-slate-300 hover:text-emerald-400 transition-colors">
              About
            </a>
            <a href="#services" className="text-slate-300 hover:text-emerald-400 transition-colors">
              Services
            </a>
            <a href="#contact" className="text-slate-300 hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </div>

          {/* User Auth Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isAdmin() ? '/admin/dashboard' : '/user/dashboard'}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>{isAdmin() ? 'Admin Portal' : 'My Dashboard'}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs sm:text-sm font-medium border border-rose-800/40 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>User Login</span>
                </Link>

                <Link
                  to="/admin/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>Admin</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
