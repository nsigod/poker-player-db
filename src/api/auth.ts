// 认证 API
import api, { setTokens, clearTokens } from './client';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string | null;
  tier: 'free' | 'monthly' | 'yearly' | 'lifetime';
  is_premium: boolean;
  tier_expires_at: string | null;
  created_at: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  setTokens(res.access_token, res.refresh_token);
  return res;
}

export async function register(email: string, password: string, name?: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/register', { email, password, name });
  setTokens(res.access_token, res.refresh_token);
  return res;
}

export async function getMe(): Promise<UserInfo> {
  return api.get<UserInfo>('/auth/me');
}

export async function getSubscriptionInfo() {
  return api.get<{
    tier: string;
    is_premium: boolean;
    tier_expires_at: string | null;
    subscription: {
      id: number;
      plan: string;
      status: string;
      payment_provider: string;
      started_at: string | null;
      expires_at: string | null;
    } | null;
  }>('/auth/subscription');
}

export async function logout() {
  clearTokens();
}

// 初始化时检查 token 是否有效
export async function checkAuth(): Promise<UserInfo | null> {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    return await getMe();
  } catch {
    clearTokens();
    return null;
  }
}
