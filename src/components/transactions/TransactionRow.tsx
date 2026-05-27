import React, { useState } from 'react'
import type { TransactionWithCategory } from '../../types/finance.types'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'

interface TransactionRowProps {
  transaction: TransactionWithCategory
  onEdit: (t: TransactionWithCategory) => void
  onDelete: (id: string) => void
}

export function TransactionRow({ transaction: t, onEdit, onDelete }: TransactionRowProps) {
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isIncome = t.type === 'income'
  const cat = t.categories

  const handleDelete = async () => {
    if (!confirm(`Excluir "${t.description}"?\nEsta ação não pode ser desfeita.`)) return
    setDeleting(true)
    try { await onDelete(t.id) } finally { setDeleting(false) }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 16px', borderRadius: 14,
        background: hovered ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.02)',
        border: hovered ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.04)',
        marginBottom: 6, transition: 'all 0.15s', cursor: 'default',
        opacity: deleting ? 0.5 : 1,
      }}
    >
      {/* ── Icon ── */}
      <div style={{
        width: 44, height: 44, borderRadius: 13, flexShrink: 0,
        background: cat?.color ? `${cat.color}20` : isIncome ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, border: `1px solid ${cat?.color ?? (isIncome ? '#22c55e' : '#ef4444')}18`,
      }}>
        {cat?.icon ?? (isIncome ? '💰' : '💸')}
      </div>

      {/* ── Main info ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t.description}
          </p>
          {t.is_subscription && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontWeight: 600, flexShrink: 0 }}>
              RECORRENTE
            </span>
          )}
          {t.installment_group_id && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 600, flexShrink: 0 }}>
              PARCELA
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {cat && (
            <span style={{ fontSize: 11, color: cat.color ?? 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color ?? '#6366f1', display: 'inline-block' }} />
              {cat.name}
            </span>
          )}
          {t.merchant && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>· {t.merchant}</span>
          )}
          {!cat && !t.merchant && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Sem categoria</span>
          )}
        </div>
      </div>

      {/* ── Date ── */}
      <div style={{ textAlign: 'right', flexShrink: 0, display: hovered ? 'none' : 'block' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          {formatDate(t.transaction_date, 'dd/MM')}
        </span>
      </div>

      {/* ── Amount ── */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isIncome ? '#4ade80' : '#f87171' }}>
          {isIncome ? '+' : '-'} {formatCurrency(Number(t.amount))}
        </p>
      </div>

      {/* ── Actions (on hover) ── */}
      <div style={{
        display: 'flex', gap: 6, flexShrink: 0,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.15s',
        pointerEvents: hovered ? 'auto' : 'none',
      }}>
        <button onClick={() => onEdit(t)} title="Editar"
          style={{
            width: 32, height: 32, borderRadius: 9, border: 'none',
            background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
            cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}>
          ✏
        </button>
        <button onClick={handleDelete} title="Excluir" disabled={deleting}
          style={{
            width: 32, height: 32, borderRadius: 9, border: 'none',
            background: 'rgba(239,68,68,0.12)', color: '#f87171',
            cursor: deleting ? 'wait' : 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}>
          {deleting ? '...' : '🗑'}
        </button>
      </div>
    </div>
  )
}
