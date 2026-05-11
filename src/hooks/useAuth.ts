// 认证 Hook
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ApiError } from '../api/client';

export function useAuth() {
  const {
    user, isLoading, isAuthenticated, isPremium, tier,
    initAuth, login, register, logout, refreshUser,
  } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // 监听登出事件（token 过期时触发）
  useEffect(() => {
    const handler = () => {
      logout();
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isPremium,
    tier,
    login,
    register,
    logout,
    refreshUser,
  };
}

export function useRequirePremium(): { isPremium: boolean; showPaywall: boolean } {
  const { isAuthenticated, isPremium } = useAuthStore();

  return {
    isPremium,
    showPaywall: !isPremium,
  };
}
