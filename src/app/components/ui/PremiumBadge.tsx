import { Plan, PLAN_NAMES } from '../../../lib/plans';

interface PremiumBadgeProps {
  plan: Exclude<Plan, 'basic'>;
  size?: 'sm' | 'md';
}

export function PremiumBadge({ plan, size = 'sm' }: PremiumBadgeProps) {
  const isPro = plan === 'pro';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-black uppercase tracking-wider border ${
      isPro
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        : 'bg-accent-purple/10 text-accent-purple border-accent-purple/20'
    } ${size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-3 py-1'}`}>
      {isPro ? '⚡' : '✦'} {PLAN_NAMES[plan]}
    </span>
  );
}
