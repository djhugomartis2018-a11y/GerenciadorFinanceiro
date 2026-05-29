import { createContext, useContext } from 'react';
import { Plan } from '../lib/plans';
import { BillingCycle, SubscriptionStatus } from '../lib/pricingConfig';

export interface SubscriptionContextValue {
  plan: Plan;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  isLoading: boolean;
  subscribe: (plan: Plan, cycle: BillingCycle) => Promise<void>;
  cancel: () => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function useSubscriptionContext(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscriptionContext must be used inside SubscriptionContext.Provider');
  return ctx;
}
