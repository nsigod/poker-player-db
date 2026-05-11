// 订阅/支付 API
import api from './client';

export interface PlanInfo {
  plan: string;
  name: string;
  price_cny: number;
  price_usd: number;
  currency: string;
  description: string;
}

export interface CheckoutResponse {
  checkout_url: string | null;
  qr_code_url: string | null;
  order_id: string | null;
}

export async function getPlans(): Promise<{ plans: PlanInfo[] }> {
  return api.get('/plans');
}

export async function createStripeCheckout(
  plan: string,
  currency: 'cny' | 'usd' = 'usd',
): Promise<CheckoutResponse> {
  return api.post(`/payment/stripe/checkout?plan=${plan}&currency=${currency}`);
}

export async function verifyStripePayment(sessionId: string): Promise<{ status: string; plan?: string }> {
  return api.get(`/payment/stripe/verify/${sessionId}`);
}

export async function createWechatCheckout(plan: string): Promise<CheckoutResponse> {
  return api.post(`/payment/wechat/checkout?plan=${plan}`);
}

export async function createAlipayCheckout(plan: string): Promise<CheckoutResponse> {
  return api.post(`/payment/alipay/checkout?plan=${plan}`);
}

export async function getMySubscription() {
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
  }>('/subscription/info');
}

export async function cancelSubscription() {
  return api.post<{ message: string; success: boolean }>('/subscription/cancel');
}

export async function getSubscriptionHistory() {
  return api.get<{
    id: number;
    plan: string;
    status: string;
    payment_provider: string;
    started_at: string | null;
    expires_at: string | null;
    is_active: boolean;
  }[]>('/subscription/history');
}
