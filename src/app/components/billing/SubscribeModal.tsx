import { Plan, PLAN_NAMES } from '../../../lib/plans';
import { BillingCycle, formatPrice } from '../../../lib/pricingConfig';
import { useSubscriptionContext } from '../../../context/SubscriptionContext';

interface SubscribeModalProps {
  plan: Plan;
  billingCycle: BillingCycle;
  onClose: () => void;
}

export function SubscribeModal({ plan, billingCycle, onClose }: SubscribeModalProps) {
  const { subscribe, isLoading } = useSubscriptionContext();

  async function handleConfirm() {
    // ─── Stripe integration point ────────────────────────────────────────
    // Today:  updates local state (mock)
    // Future: const priceId = STRIPE_PRICE_IDS[plan][billingCycle];
    //         const { url } = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ priceId }) }).then(r => r.json());
    //         window.location.href = url;
    await subscribe(plan, billingCycle);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full mx-4 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black">Resumo da assinatura</h3>
          <p className="text-xs text-text-dim">Revise os detalhes antes de confirmar.</p>
        </div>

        <div className="space-y-3 bg-background rounded-xl p-4 border border-border">
          <div className="flex justify-between text-sm">
            <span className="text-text-dim">Plano</span>
            <span className="font-bold">{PLAN_NAMES[plan]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-dim">Cobrança</span>
            <span className="font-bold">{billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-sm">
            <span className="text-text-dim">Valor</span>
            <span className="font-bold text-accent-purple">{formatPrice(plan, billingCycle)}</span>
          </div>
        </div>

        <p className="text-[11px] text-text-dim text-center">
          Modo demonstração — nenhum pagamento será cobrado.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-accent-purple text-white font-bold text-sm hover:bg-accent-purple/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Confirmar Assinatura'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
