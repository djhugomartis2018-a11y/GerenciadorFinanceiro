import React, { useState, useEffect } from 'react'
import type { TransactionWithCategory, TransactionInsert, TransactionUpdate, Category } from '../../types/finance.types'
import { toISO } from '../../utils/date'

interface TransactionFormProps {
  transaction?: TransactionWithCategory | null
  categories: Category[]
  onSubmit: (data: Omit<TransactionInsert, 'user_id'> | TransactionUpdate) => Promise<void>
  onCancel: () => void
  defaultType?: 'income' | 'expense'
}

const S: Record<string, React.CSSProperties> = {
  label: {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: 'rgba(255,255,255,0.4)', marginBottom: 7,
    textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#fff', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  },
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  )
}

export function TransactionForm({ transaction, categories, onSubmit, onCancel, defaultType = 'expense' }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'details'>('basic')

  const [form, setForm] = useState({
    description: transaction?.description ?? '',
    amount: transaction?.amount ? String(transaction.amount) : '',
    type: transaction?.type ?? defaultType,
    category_id: transaction?.category_id ?? '',
    merchant: transaction?.merchant ?? '',
    transaction_date: transaction?.transaction_date ?? toISO(new Date()),
    notes: transaction?.notes ?? '',
    is_subscription: transaction?.is_subscription ?? false,
    installment_group_id: transaction?.installment_group_id ?? '',
  })

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  // Reset form quando a prop muda
  useEffect(() => {
    setForm({
      description: transaction?.description ?? '',
      amount: transaction?.amount ? String(transaction.amount) : '',
      type: transaction?.type ?? defaultType,
      category_id: transaction?.category_id ?? '',
      merchant: transaction?.merchant ?? '',
      transaction_date: transaction?.transaction_date ?? toISO(new Date()),
      notes: transaction?.notes ?? '',
      is_subscription: transaction?.is_subscription ?? false,
      installment_group_id: transaction?.installment_group_id ?? '',
    })
    setError(null)
    setActiveTab('basic')
  }, [transaction, defaultType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.description.trim()) return setError('Descrição é obrigatória')
    const amount = parseFloat(form.amount.replace(/\./g, '').replace(',', '.'))
    if (isNaN(amount) || amount <= 0) return setError('Informe um valor válido maior que zero')
    setLoading(true)
    try {
      await onSubmit({
        description: form.description.trim(),
        amount,
        type: form.type as 'income' | 'expense',
        category_id: form.category_id || null,
        merchant: form.merchant.trim() || null,
        transaction_date: form.transaction_date,
        notes: form.notes.trim() || null,
        is_subscription: form.is_subscription,
        installment_group_id: form.installment_group_id || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(c => c.type === 'both' || c.type === form.type)
  const isIncome = form.type === 'income'

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Type toggle ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
        {(['expense', 'income'] as const).map(t => {
          const active = form.type === t
          const colors = t === 'income'
            ? { bg: 'rgba(34,197,94,0.18)', border: 'rgba(34,197,94,0.4)', color: '#4ade80' }
            : { bg: 'rgba(239,68,68,0.18)', border: 'rgba(239,68,68,0.4)', color: '#f87171' }
          return (
            <button key={t} type="button" onClick={() => { set('type', t); set('category_id', '') }}
              style={{
                padding: '12px 0', borderRadius: 12,
                border: active ? `1.5px solid ${colors.border}` : '1.5px solid rgba(255,255,255,0.07)',
                background: active ? colors.bg : 'rgba(255,255,255,0.03)',
                color: active ? colors.color : 'rgba(255,255,255,0.4)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              <span style={{ fontSize: 16 }}>{t === 'income' ? '↑' : '↓'}</span>
              {t === 'income' ? 'Receita' : 'Despesa'}
            </button>
          )
        })}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
        {(['basic', 'details'] as const).map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500,
              background: activeTab === tab ? 'rgba(99,102,241,0.25)' : 'transparent',
              color: activeTab === tab ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s',
            }}>
            {tab === 'basic' ? 'Principal' : 'Detalhes'}
          </button>
        ))}
      </div>

      {/* ── Tab: Principal ── */}
      {activeTab === 'basic' && (
        <div>
          <Field label="Descrição">
            <input
              style={S.input} value={form.description} required
              placeholder={isIncome ? 'Ex: Salário, Freelance, Dividendos...' : 'Ex: Supermercado, Aluguel, Netflix...'}
              autoFocus
              onChange={e => set('description', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.09)')}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Valor (R$)">
              <input
                style={{ ...S.input, fontSize: 18, fontWeight: 600, color: isIncome ? '#4ade80' : '#f87171' }}
                value={form.amount} required placeholder="0,00"
                type="text" inputMode="decimal"
                onChange={e => set('amount', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.09)')}
              />
            </Field>
            <Field label="Data">
              <input
                style={S.input} type="date" value={form.transaction_date}
                onChange={e => set('transaction_date', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.09)')}
              />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Categoria">
              <select
                style={{ ...S.input, cursor: 'pointer', appearance: 'none' }}
                value={form.category_id}
                onChange={e => set('category_id', e.target.value)}
              >
                <option value="">Sem categoria</option>
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Estabelecimento">
              <input
                style={S.input} value={form.merchant}
                placeholder="Ex: iFood, Mercadão..."
                onChange={e => set('merchant', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.09)')}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Tab: Detalhes ── */}
      {activeTab === 'details' && (
        <div>
          <Field label="Observações">
            <textarea
              style={{ ...S.input, minHeight: 90, resize: 'vertical', lineHeight: 1.5 }}
              value={form.notes} placeholder="Anotações opcionais sobre esta transação..."
              onChange={e => set('notes', e.target.value)}
            />
          </Field>

          {/* Recorrência */}
          <div style={{
            padding: '16px', borderRadius: 12, marginBottom: 14,
            background: form.is_subscription ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
            border: form.is_subscription ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div
                onClick={() => set('is_subscription', !form.is_subscription)}
                style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                  background: form.is_subscription ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.12)',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}>
                <div style={{
                  position: 'absolute', top: 2, borderRadius: '50%',
                  width: 20, height: 20, background: '#fff',
                  left: form.is_subscription ? 22 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: form.is_subscription ? '#a5b4fc' : 'rgba(255,255,255,0.7)' }}>
                  🔄 Assinatura recorrente
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  Marque para cobranças mensais automáticas
                </p>
              </div>
            </label>
          </div>

          {/* Parcelamento info */}
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
              📦 Parcelamento
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              Para compras parceladas, gerencie na seção de Parcelamentos. Esta transação representa uma parcela individual.
            </p>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 10, padding: '12px 14px', marginTop: 16,
          fontSize: 13, color: '#f87171',
        }}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button type="button" onClick={onCancel}
          style={{
            flex: 1, padding: '13px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', fontWeight: 500,
          }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          style={{
            flex: 2, padding: '13px', borderRadius: 12, border: 'none',
            background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Salvando...
            </>
          ) : (
            <>{transaction ? '✓ Salvar alterações' : '+ Adicionar transação'}</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}
