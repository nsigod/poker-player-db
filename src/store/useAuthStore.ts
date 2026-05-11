// 认证状态管理
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';

interface AuthState {
  user: authApi.UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  tier: 'free' | 'monthly' | 'yearly' | 'lifetime';

  // Actions
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      isPremium: false,
      tier: 'free',

      initAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await authApi.checkAuth();
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isPremium: user.is_premium,
              tier: user.tier,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const res = await authApi.login(email, password);
        const user = await authApi.getMe();
        set({
          user,
          isAuthenticated: true,
          isPremium: user.is_premium,
          tier: user.tier,
        });
      },

      register: async (email: string, password: string, name?: string) => {
        await authApi.register(email, password, name);
        const user = await authApi.getMe();
        set({
          user,
          isAuthenticated: true,
          isPremium: user.is_premium,
          tier: user.tier,
        });
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          isPremium: false,
          tier: 'free',
        });
      },

      refreshUser: async () => {
        try {
          const user = await authApi.getMe();
          set({
            user,
            isAuthenticated: true,
            isPremium: user.is_premium,
            tier: user.tier,
          });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({}), // 不持久化到 localStorage，只保留 token
    }
  )
);
