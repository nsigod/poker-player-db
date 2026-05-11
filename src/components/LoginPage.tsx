// 登录页
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { X, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { ApiError } from '../api/client';
import { useTranslation } from '../i18n/context';

interface LoginPageProps {
  onClose: () => void;
  switchToRegister: () => void;
}

export default function LoginPage({ onClose, switchToRegister }: LoginPageProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('auth.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-triton-card border border-triton-border rounded-2xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-triton-text-muted hover:text-triton-text hover:bg-triton-gold/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-triton-gold/10 rounded-full mb-4">
            <LogIn className="w-7 h-7 text-triton-gold" />
          </div>
          <h2 className="text-2xl font-bold text-triton-text">{t('auth.login')}</h2>
          <p className="text-triton-text-muted mt-1">{t('auth.loginDesc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-triton-text-muted mb-1.5">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-triton-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-triton-dark border border-triton-border rounded-lg text-triton-text placeholder-triton-text-muted/50 focus:outline-none focus:border-triton-gold/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-triton-text-muted mb-1.5">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-triton-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.enterPassword')}
                required
                className="w-full pl-10 pr-12 py-3 bg-triton-dark border border-triton-border rounded-lg text-triton-text placeholder-triton-text-muted/50 focus:outline-none focus:border-triton-gold/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-triton-text-muted hover:text-triton-text"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-triton-gold hover:bg-triton-gold/90 text-triton-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.logging') : t('auth.login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-triton-text-muted text-sm">{t('auth.noAccount')}</span>
          <button
            onClick={switchToRegister}
            className="text-triton-gold hover:text-triton-gold/80 text-sm font-medium ml-1"
          >
            {t('auth.registerNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
