import React, { useState } from 'react'
import type { TransactionFilters, Category } from '../../types/finance.types'

interface FiltersBarProps {
  filters: TransactionFilters
  categories: Category[]
  onChange: (filters: TransactionFilters) => void
  onReset: () => void
  totalCount: number
  filteredCount: number
}

const inp: React.CSSProperties = {
  padding: '9px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
}

export function TransactionFiltersBar({ filters, categories, onChange, onReset, totalCount, filteredCount }: FiltersBarProps) {
  const [expanded, setExpanded] = useState(false)

  const set = (key: keyof TransactionFilters, value: unknown) =>
    onChange({ ...filters, [key]: value || undefined })

  const activeCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== 'all').length

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)',
      marginBottom: 20, overflow: 'hidden',
    }}>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>🔍</span>
          <input
            style={{ ...inp, width: '100%', paddingLeft: 36, boxSizing: 'border-box' }}
            placeholder="Buscar por descrição ou estabelecimento..."
            value={filters.search ?? ''}
            onChange={e => set('search', e.target.value)}
          />
        </div>

        {/* Type pills */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {[
            { value: 'all', label: 'Todos' },
            { value: 'income', label: '↑ Receitas' },
            { value: 'expense', label: '↓ Despesas' },
          ].map(opt => {
            const active = (filters.type ?? 'all') === opt.value
            const color = opt.value === 'income' ? '#4ade80' : opt.value === 'expense' ? '#f87171' : '#a5b4fc'
            return (
              <button key={opt.value} onClick={() => set('type', opt.value === 'all' ? undefined : opt.value)}
                style={{
                  padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 500,
                  background: active ? `${color}22` : 'rgba(255,255,255,0.05)',
                  color: active ? color : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.15s',
                }}>
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* More filters toggle */}
        <button onClick={() => setExpanded(v => !v)}
          style={{
            padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
            background: expanded || activeCount > 1 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
            color: expanded || activeCount > 1 ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0,
          }}>
          ⚙ Filtros
          {activeCount > 1 && (
            <span style={{ background: '#6366f1', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>
              {activeCount - 1}
            </span>
          )}
        </button>

        {/* Reset */}
        {activeCount > 0 && (
          <button onClick={onReset}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
            ✕ Limpar
          </button>
        )}
      </div>

      {/* ── Expanded filters ── */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ paddingTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categoria</label>
            <select style={{ ...inp, width: '100%', appearance: 'none', cursor: 'pointer' }}
              value={filters.category_id ?? ''}
              onChange={e => set('category_id', e.target.value)}>
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div style={{ paddingTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>De</label>
            <input type="date" style={{ ...inp, width: '100%', boxSizing: 'border-box' }}
              value={filters.date_from ?? ''}
              onChange={e => set('date_from', e.target.value)} />
          </div>

          <div style={{ paddingTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Até</label>
            <input type="date" style={{ ...inp, width: '100%', boxSizing: 'border-box' }}
              value={filters.date_to ?? ''}
              onChange={e => set('date_to', e.target.value)} />
          </div>

          <div style={{ paddingTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valor mínimo</label>
            <input type="number" min="0" style={{ ...inp, width: '100%', boxSizing: 'border-box' }}
              placeholder="R$ 0,00"
              value={filters.amount_min ?? ''}
              onChange={e => set('amount_min', e.target.value ? Number(e.target.value) : undefined)} />
          </div>

          <div style={{ paddingTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valor máximo</label>
            <input type="number" min="0" style={{ ...inp, width: '100%', boxSizing: 'border-box' }}
              placeholder="R$ 9.999"
              value={filters.amount_max ?? ''}
              onChange={e => set('amount_max', e.target.value ? Number(e.target.value) : undefined)} />
          </div>

          <div style={{ paddingTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tipo especial</label>
            <select style={{ ...inp, width: '100%', appearance: 'none', cursor: 'pointer' }}
              value={filters.is_subscription === undefined ? '' : String(filters.is_subscription)}
              onChange={e => set('is_subscription', e.target.value === '' ? undefined : e.target.value === 'true')}>
              <option value="">Todos</option>
              <option value="true">🔄 Assinaturas</option>
              <option value="false">Avulsos</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Result count ── */}
      {activeCount > 0 && (
        <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          Mostrando <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{filteredCount}</span> de {totalCount} transações
        </div>
      )}
    </div>
  )
}
