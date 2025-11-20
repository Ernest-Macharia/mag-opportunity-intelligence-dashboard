'use client';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { apiClient } from '@/lib/api';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('dashboard_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.token = storedToken;
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const newToken = await apiClient.login(email, password);
      setToken(newToken);
      localStorage.setItem('dashboard_token', newToken);
      apiClient.token = newToken;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('dashboard_token');
    apiClient.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-200">Loading...</p>
        </div>
      </div>
    );
  }

  return token ? (
    <Dashboard token={token} onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}