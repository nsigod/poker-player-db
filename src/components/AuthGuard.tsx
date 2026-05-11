// AuthGuard - 认证守卫
import { useAuth } from '../hooks/useAuth';
import PaywallModal from './PaywallModal';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { useState } from 'react';
import { Crown } from 'lucide-react';
import { useTranslation } from '../i18n/context';

type AuthMode = 'none' | 'login' | 'register' | 'paywall';

interface AuthGuardProps {
  requirePremium?: boolean;
  feature?: string;
  children: React.ReactNode;
  /** 免费用户看到的替代内容 */
  fallback?: React.ReactNode;
}

export default function AuthGuard({
  requirePremium = false,
  feature,
  children,
  fallback,
}: AuthGuardProps) {
  const { t } = useTranslation();
  const { isAuthenticated, isPremium } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('none');

  if (requirePremium && !isPremium) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-triton-gold/10 rounded-full flex items-center justify-center mb-6">
              <Crown className="w-10 h-10 text-triton-gold/60" />
            </div>
            <h3 className="text-xl font-bold text-triton-text mb-2">{t('auth.premiumRequired')}</h3>
            <p className="text-triton-text-muted mb-6 max-w-md">
              {feature || t('auth.unlockDesc')}
            </p>
            <button
              onClick={() => setAuthMode('paywall')}
              className="px-8 py-3 bg-triton-gold hover:bg-triton-gold/90 text-triton-black font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Crown className="w-5 h-5" />
              {t('auth.upgradeBtn')}
            </button>
          </div>
        )}

        {authMode === 'paywall' && (
          <PaywallModal
            feature={feature}
            onClose={() => setAuthMode('none')}
            onLogin={() => setAuthMode('login')}
          />
        )}
        {authMode === 'login' && (
          <LoginPage
            onClose={() => setAuthMode('none')}
            switchToRegister={() => setAuthMode('register')}
          />
        )}
        {authMode === 'register' && (
          <RegisterPage
            onClose={() => setAuthMode('none')}
            switchToLogin={() => setAuthMode('login')}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
