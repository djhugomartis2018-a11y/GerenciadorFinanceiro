import React, { useState, useEffect, useRef } from 'react'

export interface FABAction {
  label: string
  icon: string
  color: string
  bg: string
  onClick: () => void
}

interface QuickAddFABProps {
  actions: FABAction[]
}

export function QuickAddFAB({ actions }: QuickAddFABProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Fechar com Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <>
      {/* Backdrop blur leve */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 98 }}
        />
      )}

      <div ref={ref} style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 99, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        {/* ── Action items ── */}
        {actions.map((action, i) => (
          <div
            key={action.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0) scale(1)' : `translateY(${(actions.length - i) * 16}px) scale(0.85)`,
              transition: `all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${open ? i * 0.04 : (actions.length - i) * 0.03}s`,
              pointerEvents: open ? 'auto' : 'none',
            }}
          >
            {/* Label */}
            <span style={{
              background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontSize: 13, fontWeight: 500,
              padding: '7px 14px', borderRadius: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap',
            }}>
              {action.label}
            </span>
            {/* Icon button */}
            <button
              onClick={() => { action.onClick(); setOpen(false) }}
              style={{
                width: 46, height: 46, borderRadius: '50%',
                background: action.bg, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, cursor: 'pointer', flexShrink: 0,
                boxShadow: `0 4px 16px ${action.bg}88`,
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {action.icon}
            </button>
          </div>
        ))}

        {/* ── Main FAB ── */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Fechar menu' : 'Ações rápidas'}
          style={{
            width: 58, height: 58, borderRadius: '50%',
            background: open
              ? 'rgba(239,68,68,0.85)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: '#fff',
            boxShadow: open
              ? '0 6px 24px rgba(239,68,68,0.4)'
              : '0 6px 28px rgba(99,102,241,0.5)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          +
        </button>
      </div>
    </>
  )
}
