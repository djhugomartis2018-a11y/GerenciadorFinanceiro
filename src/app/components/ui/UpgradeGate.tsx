import { useState } from 'react';
import { GatedFeature, FEATURE_REQUIRES, PLAN_NAMES, PLAN_HIGHLIGHTS, hasFeature } from '../../../lib/plans';
import { PRICING } from '../../../lib/pricingConfig';
import { useSubscriptionContext } from '../../../context/SubscriptionContext';
import { SubscribeModal } from '../billing/SubscribeModal';
import { PremiumBadge } from './PremiumBadge';

interface UpgradeGateProps {
  feature: GatedFeature;
  children: React.ReactNode;
}

export function UpgradeGate({ feature, children }: UpgradeGateProps) {
  const { plan, billingCycle } = useSubscriptionContext();
  const [showModal, setShowModal] = useState(false);

  if (hasFeature(plan, feature)) return <>{children}</>;

  const requiredPlan = FEATURE_REQUIRES[feature];
  const highlights = PLAN_HIGHLIGHTS[requiredPlan as keyof typeof PLAN_HIGHLIGHTS] ?? [];
  const price = PRICING[requiredPlan]?.monthly ?? 0;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 rounded-2xl border border-border bg-surface text-center max-w-md mx-auto">

        <PremiumBadge plan={requiredPlan as Exclude<typeof requiredPlan, 'basic'>} size="md" />

        <div className="space-y-1">
          <h3 className="text-lg font-black">
            Disponível no plano {PLAN_NAMES[requiredPlan]}
          </h3>
          <p className="text-xs text-text-dim">
            Desbloqueie este e outros recursos por apenas R${price}/mês.
          </p>
        </div>

        {highlights.length > 0 && (
          <ul className="w-full space-y-2 text-left">
            {highlights.slice(0, 5).map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <span className="text-accent-purple text-xs">✓</span>
                <span className="text-foreground font-medium">{item}</span>
              </li>
            ))}
            {highlights.length > 5 && (
              <li className="text-xs text-text-dim pl-4">
                + {highlights.length - 5} outros recursos
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-xl bg-accent-purple text-white font-bold text-sm hover:bg-accent-purple/90 transition-colors shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            Fazer upgrade — {PLAN_NAMES[requiredPlan]}
          </button>
        </div>
      </div>

      {showModal && (
        <SubscribeModal
          plan={requiredPlan}
          billingCycle={billingCycle}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
