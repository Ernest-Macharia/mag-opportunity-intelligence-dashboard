'use client';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Rocket } from 'lucide-react';
import { LoginFormProps } from '@/types';

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('superadmin@crm.local');
  const [password, setPassword] = useState('Testme123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(email, password);
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-orange-800">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500/20 p-3 rounded-full">
              <Rocket className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            Opportunity Dashboard
          </h1>
          <p className="text-orange-200">Sign in to access your insights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-orange-200 text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-orange-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-orange-200 text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-orange-800 rounded-xl pl-12 pr-12 py-4 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-orange-300 text-sm">
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
}