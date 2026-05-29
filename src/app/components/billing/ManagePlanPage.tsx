import { useState } from 'react';
import { Plan, PLAN_NAMES } from '../../../lib/plans';
import { formatPrice } from '../../../lib/pricingConfig';
import { useSubscriptionContext } from '../../../context/SubscriptionContext';
import { SubscribeModal } from './SubscribeModal';

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  trial: 'Trial',
  canceled: 'Cancelado',
  expired: 'Expirado',
};

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-accent-purple/10 text-accent-purple',
  trial:    'bg-blue-bg text-blue',
  canceled: 'bg-red-bg text-red-400',
  expired:  'bg-red-bg text-red-400',
};

const NEXT_PLAN: Partial<Record<Plan, Plan>> = {
  basic: 'essential',
  essential: 'pro',
};

export function ManagePlanPage() {
  const { plan, billingCycle, status, cancel, isLoading } = useSubscriptionContext();
  const [showModal, setShowModal] = useState(false);
  const upgradeTo = NEXT_PLAN[plan];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <h2 className="text-3xl font-black tracking-tight">Meu Plano</h2>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">Plano atual</p>
            <p className="text-2xl font-black">{PLAN_NAMES[plan]}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[status] ?? STATUS_STYLES.canceled}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        {plan !== 'basic' && (
          <>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-sm">
              <span className="text-text-dim">Cobrança</span>
              <span className="font-bold">{billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim">Valor</span>
              <span className="font-bold">{formatPrice(plan, billingCycle)}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {upgradeTo && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-xl bg-accent-purple text-white font-bold text-sm hover:bg-accent-purple/90 transition-colors"
          >
            Upgrade para {PLAN_NAMES[upgradeTo]}
          </button>
        )}
        {plan !== 'basic' && (
          <button
            onClick={cancel}
            disabled={isLoading}
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/5 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Cancelando...' : 'Cancelar assinatura'}
          </button>
        )}
      </div>

      {showModal && upgradeTo && (
        <SubscribeModal
          plan={upgradeTo}
          billingCycle={billingCycle}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
