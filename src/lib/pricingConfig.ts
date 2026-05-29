import { Plan } from './plans';

export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';

export const PRICING: Record<Plan, Record<BillingCycle, number>> = {
  basic:     { monthly: 0,  yearly: 0   },
  essential: { monthly: 19, yearly: 190 },
  pro:       { monthly: 39, yearly: 390 },
};

// ─── Stripe integration point ────────────────────────────────────────────────
// Replace with real price IDs from Stripe Dashboard when connecting billing.
// Usage: STRIPE_PRICE_IDS['essential']['monthly'] → 'price_...'
export const STRIPE_PRICE_IDS: Record<Exclude<Plan, 'basic'>, Record<BillingCycle, string>> = {
  essential: { monthly: 'price_1TcX3OQgqX8fWOOJHLnxIBSw', yearly: 'price_1TcX3yQgqX8fWOOJ92fHFVzx' },
  pro:       { monthly: 'price_1TcX4QQgqX8fWOOJn1ugyqZd', yearly: 'price_1TcX4qQgqX8fWOOJiYnwoY4W' },
};

export function formatPrice(plan: Plan, cycle: BillingCycle): string {
  const price = PRICING[plan][cycle];
  if (price === 0) return 'Grátis';
  return cycle === 'yearly' ? `R$${price}/ano` : `R$${price}/mês`;
}

export function getMonthlyCost(plan: Plan, cycle: BillingCycle): number {
  if (cycle === 'yearly') return Math.floor(PRICING[plan].yearly / 12);
  return PRICING[plan].monthly;
}

export function getYearlySavings(plan: Plan): number {
  return PRICING[plan].monthly * 12 - PRICING[plan].yearly;
}
