import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

// FAB foi movido para dentro de cada page que precisar dele
// AppShell agora é apenas layout sem FAB global

interface AppShellProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0b0c14' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar onMenuToggle={() => setSidebarCollapsed(v => !v)} currentPage={currentPage} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
