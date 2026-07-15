import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../utils/api';
import { Lock, User, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiService.login({ username, password });
      if (data.token) {
        localStorage.setItem('ybm_admin_token', data.token);
        localStorage.setItem('ybm_admin_user', data.user.username);
        navigate('/admin');
      } else {
        setError('Login failed. Token not returned.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="YBM Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="font-serif-display text-2xl tracking-[2px] font-bold text-dark uppercase">CMS Console</h1>
          <p className="text-primary text-[10px] tracking-[3px] uppercase mt-1">YBM Construction Admin</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-slate-600 mb-2 block">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-10 pr-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-slate-600 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-10 pr-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-2">Default credentials: admin / admin123</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-dark text-white font-sans font-bold tracking-[2px] text-xs py-4 rounded uppercase transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-slate-400 hover:text-primary transition-colors tracking-wide">&larr; Return to main site</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
