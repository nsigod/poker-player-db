// 用户中心/导航栏用户菜单
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, Crown, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/context';

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isPremium, tier, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button className="px-4 py-1.5 text-sm text-triton-text-muted hover:text-triton-text transition-colors">
          {t('auth.login')}
        </button>
        <button className="px-4 py-1.5 text-sm bg-triton-gold hover:bg-triton-gold/90 text-triton-black font-medium rounded-lg transition-colors">
          {t('auth.register')}
        </button>
      </div>
    );
  }

  const tierLabel = {
    free: t('auth.freeUser'),
    monthly: t('auth.monthlyMember'),
    yearly: t('auth.yearlyMember'),
    lifetime: t('auth.lifetimeMember'),
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-triton-gold/10 transition-colors"
      >
        <div className="w-8 h-8 bg-triton-gold/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-triton-gold" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-triton-text">{user?.name || user?.email}</div>
          <div className={`text-xs flex items-center gap-1 ${isPremium ? 'text-triton-gold' : 'text-triton-text-muted'}`}>
            {isPremium && <Crown className="w-3 h-3" />}
            {tierLabel[tier]}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-triton-text-muted" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-triton-card border border-triton-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-triton-border">
            <div className="text-sm font-medium text-triton-text">{user?.name || t('auth.user')}</div>
            <div className="text-xs text-triton-text-muted">{user?.email}</div>
          </div>
          <div className="py-1">
            {!isPremium && (
              <button className="w-full px-4 py-2 text-sm text-left text-triton-gold hover:bg-triton-gold/10 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                {t('auth.upgrade')}
              </button>
            )}
            {isPremium && (
              <button className="w-full px-4 py-2 text-sm text-left text-triton-text-muted hover:bg-triton-dark flex items-center gap-2">
                <Crown className="w-4 h-4" />
                {t('auth.manageSubscription')}
              </button>
            )}
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
