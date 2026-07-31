import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, showToast } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const registeredMessage = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMessage('Username/Email and Password are required');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/user/login', {
        usernameOrEmail: usernameOrEmail.trim(),
        password: password.trim(),
      });

      const jwtData = res.data;
      login(jwtData);

      if (jwtData.firstLogin) {
        showToast('First login detected! Please set your new password.', 'info');
        navigate('/reset-password');
      } else {
        showToast('Login successful! Welcome back.', 'success');
        navigate('/user/dashboard');
      }
    } catch (err) {
      setErrorMessage(typeof err === 'string' ? err : 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">User Portal Login</h1>
            <p className="text-xs text-slate-400">
              Enter your credentials or temporary password sent via email
            </p>
          </div>

          {registeredMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Registration Request Submitted!</p>
                <p className="mt-0.5">Your profile is currently PENDING Admin approval. You will receive an email with login credentials once approved.</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username or Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Username or user@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password / Temporary Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Account'}
              </button>

            </form>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <Link to="/register" className="hover:text-emerald-400 transition-colors">
              Need an account? Register here
            </Link>
            <Link to="/admin/login" className="flex items-center gap-1 hover:text-teal-400 transition-colors">
              <Shield className="w-3.5 h-3.5 text-teal-400" /> Admin Portal
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserLoginPage;
