import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setError('');
    // Placeholder: show neutral message
    setTimeout(() => {
      setError('Password reset requests are processed through your department administrator.');
      setForgotPassword(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-slate-700 mb-4">
              <span className="text-2xl" aria-hidden>🔐</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-100">
              Welfare Leakage Intelligence Platform
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Authorized Access Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                Official Email / Username
              </label>
              <input
                id="email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter official email"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={forgotPassword}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotPassword}
                className="w-full py-2 text-sm text-slate-400 hover:text-slate-300 focus:outline-none disabled:opacity-50 transition-colors"
              >
                Forgot Password
              </button>
            </div>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center border-t border-slate-700 pt-6">
            For Government Use Only • Audit & Accountability
          </p>
        </div>
      </div>
    </div>
  );
}
