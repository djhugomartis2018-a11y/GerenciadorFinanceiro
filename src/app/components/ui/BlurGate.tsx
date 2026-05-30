import { useState } from 'react';
import { GatedFeature, FEATURE_REQUIRES, PLAN_NAMES, hasFeature } from '../../../lib/plans';
import { useSubscriptionContext } from '../../../context/SubscriptionContext';
import { SubscribeModal } from '../billing/SubscribeModal';
import { PremiumBadge } from './PremiumBadge';

interface BlurGateProps {
  feature: GatedFeature;
  children: React.ReactNode;
  label?: string;
}

export function BlurGate({ feature, children, label }: BlurGateProps) {
  const { plan, billingCycle } = useSubscriptionContext();
  const [showModal, setShowModal] = useState(false);

  if (hasFeature(plan, feature)) return <>{children}</>;

  const requiredPlan = FEATURE_REQUIRES[feature];

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden">
        <div
          aria-hidden="true"
          style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}
        >
          {children}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/75 backdrop-blur-[2px] gap-3">
          <PremiumBadge plan={requiredPlan as Exclude<typeof requiredPlan, 'basic'>} size="md" />
          <p className="text-sm font-bold text-center px-6">
            {label ?? `Disponível no plano ${PLAN_NAMES[requiredPlan]}`}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-full bg-accent-purple text-white text-sm font-bold hover:bg-accent-purple/90 transition-colors shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            Desbloquear recurso
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
