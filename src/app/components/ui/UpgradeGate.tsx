import { useState } from 'react';
import { GatedFeature, FEATURE_REQUIRES, PLAN_NAMES, hasFeature } from '../../../lib/plans';
import { useSubscriptionContext } from '../../../context/SubscriptionContext';
import { SubscribeModal } from '../billing/SubscribeModal';

interface UpgradeGateProps {
  feature: GatedFeature;
  children: React.ReactNode;
}

export function UpgradeGate({ feature, children }: UpgradeGateProps) {
  const { plan, billingCycle } = useSubscriptionContext();
  const [showModal, setShowModal] = useState(false);

  if (hasFeature(plan, feature)) return <>{children}</>;

  const requiredPlan = FEATURE_REQUIRES[feature];

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-2xl border border-border bg-surface text-center">
        <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold">Disponível no plano {PLAN_NAMES[requiredPlan]}</p>
          <p className="text-xs text-text-dim">Faça upgrade para desbloquear este recurso.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 rounded-full bg-accent-purple text-white text-sm font-bold hover:bg-accent-purple/90 transition-colors"
        >
          Fazer upgrade
        </button>
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
