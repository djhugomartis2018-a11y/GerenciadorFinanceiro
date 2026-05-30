import { useSubscriptionContext } from '../context/SubscriptionContext';
import { hasFeature, canAddMonth, GatedFeature } from './plans';

export function useFeature() {
  const { plan } = useSubscriptionContext();

  return {
    plan,
    can: (feature: GatedFeature) => hasFeature(plan, feature),
    canAddMonth: (count: number) => canAddMonth(plan, count),
  };
}
