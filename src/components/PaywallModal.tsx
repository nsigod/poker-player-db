// 付费墙弹窗
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { X, Crown, Zap, Check, CreditCard } from 'lucide-react';
import * as subscriptionApi from '../api/subscription';
import { ApiError } from '../api/client';
import { useTranslation } from '../i18n/context';

interface PaywallModalProps {
  feature?: string;
  onClose: () => void;
  onLogin: () => void;
}

export default function PaywallModal({ feature, onClose, onLogin }: PaywallModalProps) {
  const { t } = useTranslation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { isAuthenticated, isPremium } = useAuthStore();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const PLANS = [
    {
      plan: 'monthly',
      name: t('paywall.monthly'),
      price: '$150',
      period: t('paywall.monthPeriod'),
      description: t('paywall.monthlyDesc'),
      popular: false,
    },
    {
      plan: 'yearly',
      name: t('paywall.yearly'),
      price: '$500',
      period: t('paywall.yearPeriod'),
      description: t('paywall.yearlyDesc'),
      popular: true,
    },
    {
      plan: 'lifetime',
      name: t('paywall.lifetime'),
      price: '$1,888',
      period: '',
      description: t('paywall.lifetimeDesc'),
      popular: false,
    },
  ];

  const handleSubscribe = async (plan: string) => {
    if (!isAuthenticated) {
      onLogin();
      return;
    }

    setLoadingPlan(plan);
    try {
      const res = await subscriptionApi.createStripeCheckout(
        plan as 'monthly' | 'yearly' | 'lifetime',
        'usd',
      );
      if (res.checkout_url) {
        setPaymentUrl(res.checkout_url);
        // 跳转 Stripe 支付页
        window.open(res.checkout_url, '_blank');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert(t('paywall.paymentFailed'));
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-triton-card border border-triton-border rounded-2xl shadow-2xl overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-lg text-triton-text-muted hover:text-triton-text hover:bg-triton-gold/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 头部 */}
        <div className="bg-gradient-to-r from-triton-gold/10 via-triton-gold/5 to-triton-dark p-8 text-center border-b border-triton-border">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-triton-gold/20 rounded-full mb-4">
            <Crown className="w-8 h-8 text-triton-gold" />
          </div>
          <h2 className="text-3xl font-bold text-triton-text mb-2">
            {feature ? t('paywall.feature', { name: feature }) : t('paywall.subscribe')}
          </h2>
          <p className="text-triton-text-muted max-w-lg mx-auto">
            {t('paywall.featureDesc')}
          </p>

        </div>

        {/* 计划卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {PLANS.map((p) => (
            <div
              key={p.plan}
              className={`relative rounded-xl border p-5 transition-all ${
                p.popular
                  ? 'border-triton-gold bg-triton-gold/5 scale-[1.02]'
                  : 'border-triton-border hover:border-triton-gold/40'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-triton-gold text-triton-black text-xs font-bold rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {t('paywall.recommended')}
                </div>
              )}

              <h3 className="text-lg font-bold text-triton-text">{p.name}</h3>
              <p className="text-triton-text-muted text-sm mt-1">{p.description}</p>

              <div className="mt-4 mb-4">
                <span className="text-3xl font-bold text-triton-text">
                  {p.price}
                </span>
                <span className="text-triton-text-muted text-sm">{p.period}</span>
              </div>

              <ul className="space-y-2 mb-5 text-sm text-triton-text-muted">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-triton-gold flex-shrink-0" />
                  {t('paywall.fullProfile')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-triton-gold flex-shrink-0" />
                  {t('paywall.fullRecords')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-triton-gold flex-shrink-0" />
                  {t('paywall.avatar')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-triton-gold flex-shrink-0" />
                  {t('paywall.fullVideoAccess')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-triton-gold flex-shrink-0" />
                  {t('paywall.unlimitedSearch')}
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(p.plan)}
                disabled={loadingPlan === p.plan}
                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  p.popular
                    ? 'bg-triton-gold hover:bg-triton-gold/90 text-triton-black'
                    : 'bg-triton-dark border border-triton-gold/50 text-triton-gold hover:bg-triton-gold/10'
                } disabled:opacity-50`}
              >
                <CreditCard className="w-4 h-4" />
                {loadingPlan === p.plan ? t('paywall.processing') : isPremium && p.plan === 'yearly' ? t('paywall.currentPlan') : t('paywall.subscribeNow')}
              </button>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="px-6 pb-6 text-center">
          <p className="text-triton-text-muted text-xs">
            {t('paywall.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
