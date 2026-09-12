import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate(redirect);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-0">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Sign in to your AuraShop account to continue
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Quick Access Buttons */}
        <div className="bg-indigo-50/60 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 text-center">
            Quick Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user@example.com', 'User123!')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm transition"
            >
              <UserCheck className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@example.com', 'Admin123!')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-sm transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none transition"
              />
              <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 outline-none transition"
              />
              <Lock className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to={`/signup?redirect=${encodeURIComponent(redirect)}`}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
