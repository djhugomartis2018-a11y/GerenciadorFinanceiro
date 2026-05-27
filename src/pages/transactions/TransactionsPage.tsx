import React, { useState, useCallback, useMemo } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useGoals } from '../../hooks/useGoals'
import { useAppContext } from '../../context/AppContext'
import { TransactionRow } from '../../components/transactions/TransactionRow'
import { TransactionForm } from '../../components/transactions/TransactionForm'
import { TransactionFiltersBar } from '../../components/transactions/TransactionFiltersBar'
import { QuickAddFAB } from '../../components/common/QuickAddFAB'
import type { FABAction } from '../../components/common/QuickAddFAB'
import { Modal } from '../../components/common/Modal'
import { EmptyState } from '../../components/common/EmptyState'
import { TransactionRowSkeleton } from '../../components/common/Skeleton'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { parseISO, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { TransactionWithCategory, TransactionFilters, TransactionInsert, TransactionUpdate } from '../../types/finance.types'

const EMPTY_FILTERS: TransactionFilters = {}

// Agrupa transações por data
function groupByDate(txs: TransactionWithCategory[]): Map<string, TransactionWithCategory[]> {
  const map = new Map<string, TransactionWithCategory[]>()
  txs.forEach(t => {
    const key = t.transaction_date
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(t)
  })
  return map
}

function DateGroupHeader({ date, txs }: { date: string; txs: TransactionWithCategory[] }) {
  const dayIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const dayExpense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  const d = parseISO(date)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const isToday = format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  const isYesterday = format(d, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')
  const label = isToday ? 'Hoje' : isYesterday ? 'Ontem' : format(d, "dd 'de' MMMM", { locale: ptBR })

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 4px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: isToday ? '#a5b4fc' : 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
          {label}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 20 }}>
          {txs.length} {txs.length === 1 ? 'item' : 'itens'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        {dayIncome > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: '#4ade80' }}>+{formatCurrency(dayIncome)}</span>}
        {dayExpense > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: '#f87171' }}>-{formatCurrency(dayExpense)}</span>}
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  const { state } = useAppContext()
  const { transactions, loading, error, filters, setFilters, create, update, remove } = useTransactions()
  const { create: createGoal } = useGoals()

  const [modalOpen, setModalOpen] = useState(false)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<TransactionWithCategory | null>(null)
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>('expense')
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped')

  const categories = state.categories

  const openCreate = useCallback((type: 'income' | 'expense' = 'expense') => {
    setEditingTx(null)
    setDefaultType(type)
    setModalOpen(true)
  }, [])

  const openEdit = useCallback((tx: TransactionWithCategory) => {
    setEditingTx(tx)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingTx(null)
  }, [])

  const handleSubmit = useCallback(async (data: Omit<TransactionInsert, 'user_id'> | TransactionUpdate) => {
    if (editingTx) {
      await update(editingTx.id, data as TransactionUpdate)
    } else {
      await create(data as Omit<TransactionInsert, 'user_id'>)
    }
    closeModal()
  }, [editingTx, create, update, closeModal])

  // ── Stats ──
  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0), [transactions])
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0), [transactions])
  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0

  // ── Grouping ──
  const grouped = useMemo(() => groupByDate(transactions), [transactions])
  const sortedDates = useMemo(() => Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a)), [grouped])

  const hasActiveFilters = Object.keys(filters).some(k => filters[k as keyof TransactionFilters] !== undefined)

  // ── FAB actions ──
  const fabActions: FABAction[] = [
    {
      label: 'Nova despesa',
      icon: '➖',
      color: '#f87171',
      bg: 'rgba(239,68,68,0.85)',
      onClick: () => openCreate('expense'),
    },
    {
      label: 'Nova receita',
      icon: '➕',
      color: '#4ade80',
      bg: 'rgba(34,197,94,0.85)',
      onClick: () => openCreate('income'),
    },
    {
      label: 'Nova meta',
      icon: '🎯',
      color: '#a5b4fc',
      bg: 'rgba(99,102,241,0.85)',
      onClick: () => setGoalModalOpen(true),
    },
    {
      label: 'Nova assinatura',
      icon: '🔄',
      color: '#fbbf24',
      bg: 'rgba(245,158,11,0.85)',
      onClick: () => { setDefaultType('expense'); setEditingTx(null); setModalOpen(true) },
    },
  ]

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
            Transações
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            {loading ? 'Carregando...' : `${transactions.length} transaç${transactions.length !== 1 ? 'ões' : 'ão'} encontrada${transactions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View mode toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 3 }}>
            {(['grouped', 'list'] as const).map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12,
                  background: viewMode === v ? 'rgba(99,102,241,0.3)' : 'transparent',
                  color: viewMode === v ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.15s',
                }}>
                {v === 'grouped' ? '≡ Agrupado' : '☰ Lista'}
              </button>
            ))}
          </div>
          <button onClick={() => openCreate('income')}
            style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            + Receita
          </button>
          <button onClick={() => openCreate('expense')}
            style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            + Despesa
          </button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Receitas', value: totalIncome, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', icon: '↑' },
          { label: 'Despesas', value: totalExpenses, color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', icon: '↓' },
          { label: 'Saldo', value: balance, color: balance >= 0 ? '#4ade80' : '#f87171', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)', icon: '=' },
          { label: 'Taxa poupança', value: null, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', icon: '◎', rate: savingsRate },
        ].map(({ label, value, color, bg, border, icon, rate }) => (
          <div key={label} style={{ padding: '16px 18px', borderRadius: 16, background: bg, border: `1px solid ${border}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 18, opacity: 0.25, color }}>{icon}</div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color }}>
              {rate !== undefined ? `${rate.toFixed(1)}%` : formatCurrency(value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <TransactionFiltersBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
        totalCount={transactions.length}
        filteredCount={transactions.length}
      />

      {/* ── Error ── */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, color: '#f87171', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div>
          {[1, 2, 3, 4, 5, 6].map(i => <TransactionRowSkeleton key={i} />)}
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={hasActiveFilters ? '🔍' : '💸'}
          title={hasActiveFilters ? 'Nenhum resultado' : 'Sem transações ainda'}
          description={
            hasActiveFilters
              ? 'Nenhuma transação corresponde aos filtros aplicados. Tente ajustá-los.'
              : 'Comece registrando sua primeira receita ou despesa para visualizar seu histórico financeiro.'
          }
          action={!hasActiveFilters ? { label: '+ Adicionar primeira transação', onClick: () => openCreate() } : { label: 'Limpar filtros', onClick: () => setFilters(EMPTY_FILTERS) }}
        />
      ) : viewMode === 'grouped' ? (
        // Grouped view
        <div>
          {sortedDates.map(date => {
            const txs = grouped.get(date)!
            return (
              <div key={date}>
                <DateGroupHeader date={date} txs={txs} />
                {txs.map(tx => <TransactionRow key={tx.id} transaction={tx} onEdit={openEdit} onDelete={remove} />)}
              </div>
            )
          })}
          {/* Footer count */}
          <div style={{ textAlign: 'center', padding: '24px 0 80px', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            {transactions.length} transaç{transactions.length !== 1 ? 'ões' : 'ão'} no total
          </div>
        </div>
      ) : (
        // Flat list view
        <div>
          {transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} onEdit={openEdit} onDelete={remove} />)}
          <div style={{ textAlign: 'center', padding: '24px 0 80px', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            {transactions.length} transaç{transactions.length !== 1 ? 'ões' : 'ão'} no total
          </div>
        </div>
      )}

      {/* ── Transaction Modal ── */}
      <Modal open={modalOpen} onClose={closeModal} width={520}
        title={editingTx
          ? `Editar — ${editingTx.description.slice(0, 30)}${editingTx.description.length > 30 ? '...' : ''}`
          : defaultType === 'income' ? '+ Nova receita' : '+ Nova despesa'
        }>
        <TransactionForm
          transaction={editingTx}
          categories={categories}
          defaultType={defaultType}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      {/* ── Quick Goal Modal ── */}
      <Modal open={goalModalOpen} onClose={() => setGoalModalOpen(false)} width={400} title="🎯 Nova meta rápida">
        <QuickGoalForm onSubmit={async (name, target) => {
          await createGoal({ name, target_amount: target, icon: '🎯', color: '#6366f1' })
          setGoalModalOpen(false)
        }} onCancel={() => setGoalModalOpen(false)} />
      </Modal>

      {/* ── FAB ── */}
      <QuickAddFAB actions={fabActions} />
    </div>
  )
}

// ── Mini goal form para o FAB ──
function QuickGoalForm({ onSubmit, onCancel }: { onSubmit: (name: string, target: number) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
    color: '#fff', fontSize: 14, outline: 'none', marginBottom: 14, fontFamily: 'inherit',
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    const t = parseFloat(target.replace(',', '.'))
    if (!name.trim() || isNaN(t) || t <= 0) return
    setLoading(true)
    try { await onSubmit(name.trim(), t) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handle}>
      <input style={inp} placeholder="Nome da meta (ex: Viagem, Reserva...)" value={name} autoFocus required onChange={e => setName(e.target.value)} />
      <input style={inp} placeholder="Valor alvo (ex: 5000)" value={target} required inputMode="decimal" onChange={e => setTarget(e.target.value)} />
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
        <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Criando...' : 'Criar meta'}
        </button>
      </div>
    </form>
  )
}
