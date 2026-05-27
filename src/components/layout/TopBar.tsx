import React from 'react'
import { formatMonthYear } from '../../utils/date'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transações',
  goals: 'Metas',
  analytics: 'Analytics',
  profile: 'Perfil',
  settings: 'Configurações',
}

interface TopBarProps {
  onMenuToggle: () => void
  currentPage: string
}

export function TopBar({ onMenuToggle, currentPage }: TopBarProps) {
  const currentMonth = formatMonthYear(new Date())
  const title = PAGE_TITLES[currentPage] ?? ''

  return (
    <header style={{
      height: 60, display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 16,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(11,12,20,0.8)',
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
    }}>
      <button
        onClick={onMenuToggle}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 18, padding: 4, borderRadius: 8, display: 'flex', alignItems: 'center' }}
        aria-label="Alternar menu">
        ☰
      </button>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{title}</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: 20 }}>
        {currentMonth}
      </span>
    </header>
  )
}
