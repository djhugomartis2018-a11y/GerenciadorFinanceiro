import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react'
import {
  Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import {
  LayoutGrid, TrendingUp, Target, User, Plus, Trash2, LogOut,
  ChevronRight, Wallet, ArrowUpCircle, ArrowDownCircle, Calendar,
  CreditCard, Settings, ArrowLeftRight, BarChart2
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { supabase } from './lib/supabase'
import { AppProvider, useAppContext } from './context/AppContext'
import { useAuth } from './hooks/useAuth'

// ── Lazy new pages ──────────────────────────────────────────
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage'))
const GoalsPage        = lazy(() => import('./pages/goals/GoalsPage'))
const AnalyticsPage    = lazy(() => import('./pages/analytics/AnalyticsPage'))
const NewDashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const ProfilePage      = lazy(() => import('./pages/profile/ProfilePage'))
const SettingsPage     = lazy(() => import('./pages/settings/SettingsPage'))

// ── LandingPage original ────────────────────────────────────
import { LandingPage } from './app/components/landing/LandingPage'
import { LoginPage }   from './app/components/auth/LoginPage'

// ── Chart.js setup ──────────────────────────────────────────
ChartJS.register(ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler)
ChartJS.defaults.color = '#999999'
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1a1a1a'
ChartJS.defaults.plugins.tooltip.titleColor = '#fff'
ChartJS.defaults.plugins.tooltip.bodyColor = '#a5b4fc'
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)'
ChartJS.defaults.plugins.tooltip.borderWidth = 1

// ── Types (app original) ────────────────────────────────────
interface Receita { desc: string; val: number }
interface Fixa { desc: string; dia: string | number; val: number; pago: boolean }
interface Variavel { desc: string; val: number }
interface MesData { receitas: Receita[]; fixas: Fixa[]; variaveis: Variavel[] }
interface Meta { desc: string; total: number; guardei: number }
interface AppData { months: string[]; mesData: Record<string, MesData>; metas: Meta[] }

const defaultMesData = (): MesData => ({
  receitas: [{ desc: 'Salário principal', val: 0 }, { desc: 'Renda extra', val: 0 }],
  fixas: [
    { desc: 'Aluguel / Financiamento', dia: 5, val: 0, pago: false },
    { desc: 'Energia elétrica', dia: 10, val: 0, pago: false },
    { desc: 'Água', dia: 15, val: 0, pago: false },
    { desc: 'Internet', dia: 10, val: 0, pago: false },
    { desc: 'Mercado', dia: '', val: 0, pago: false },
  ],
  variaveis: [],
})
const defaultMetas = (): Meta[] => [
  { desc: 'Reserva de Emergência', total: 0, guardei: 0 },
  { desc: 'Viagem dos Sonhos', total: 0, guardei: 0 },
]
const getDefaultData = (): AppData => ({
  months: ['Jan/2024', 'Fev/2024'],
  mesData: {
    'Jan/2024': {
      receitas: [{ desc: 'Salário', val: 5000 }],
      fixas: [{ desc: 'Aluguel', dia: 5, val: 1200, pago: true }, { desc: 'Internet', dia: 10, val: 100, pago: true }],
      variaveis: [{ desc: 'Lazer', val: 800 }],
    },
    'Fev/2024': {
      receitas: [{ desc: 'Salário', val: 5200 }],
      fixas: [{ desc: 'Aluguel', dia: 5, val: 1200, pago: false }, { desc: 'Internet', dia: 10, val: 100, pago: false }],
      variaveis: [{ desc: 'Restaurante', val: 400 }],
    },
  },
  metas: defaultMetas(),
})

const fmt = (v: number) => 'R$ ' + parseFloat((v || 0).toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const n = (v: unknown) => parseFloat(v as string) || 0
const calcMonth = (data: AppData, key: string) => {
  const m = data.mesData[key]
  if (!m) return { rec: 0, fixas: 0, variaveis: 0, pagar: 0, saldo: 0 }
  const rec = m.receitas.reduce((s, r) => s + n(r.val), 0)
  const fixas = m.fixas.reduce((s, r) => s + n(r.val), 0)
  const variaveis = m.variaveis.reduce((s, r) => s + n(r.val), 0)
  return { rec, fixas, variaveis, pagar: fixas + variaveis, saldo: rec - fixas - variaveis }
}

// ── Shared styles ────────────────────────────────────────────
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16, padding: '20px 22px',
}
const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10, color: '#fff', fontSize: 13, padding: '9px 12px',
  outline: 'none', width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}

// ── NAV ITEMS (merged) ───────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'MENU PRINCIPAL',
    items: [
      { id: 'overview',      icon: LayoutGrid,     label: 'Painel Geral' },
      { id: 'transactions',  icon: ArrowLeftRight,  label: 'Transações' },
      { id: 'metas_new',     icon: Target,          label: 'Metas' },
      { id: 'historico',     icon: TrendingUp,      label: 'Análises' },
      { id: 'analytics_new', icon: BarChart2,        label: 'Analytics Pro' },
    ],
  },
  {
    label: 'PLANEJAMENTO MENSAL',
    items: [], // months go here dynamically
  },
  {
    label: 'CONTA',
    items: [
      { id: 'perfil', icon: User,     label: 'Meu Perfil' },
      { id: 'settings_new', icon: Settings, label: 'Configurações' },
    ],
  },
]

// ── MAIN APP ─────────────────────────────────────────────────
function MainApp() {
  const { isAuthenticated, initialized } = useAuth()
  const { state, dispatch } = useAppContext()

  const [showLanding, setShowLanding] = useState(true)
  const [currentPage, setCurrentPage] = useState('overview')
  const [currentMonth, setCurrentMonth] = useState<string | null>(null)
  const [currentTab, setCurrentTab]   = useState('resumo')
  const [newMonthInput, setNewMonthInput] = useState('')
  const [isSyncing, setIsSyncing]     = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // App data (original system)
  const [data, setData] = useState<AppData>(getDefaultData())

  // Load data from Supabase
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data: dbData, error } = await (supabase as any)
        .from('user_data').select('data').eq('id', userId).maybeSingle()
      if (error) throw error
      if (dbData?.data) {
        const parsed = dbData.data as unknown as AppData
        setData(parsed)
        const months = parsed.months
        if (months.length > 0) setCurrentMonth(months[months.length - 1])
      } else {
        const localRaw = localStorage.getItem('gestao_salario_v2')
        if (localRaw) {
          const parsed = JSON.parse(localRaw) as AppData
          setData(parsed)
          await saveUserData(userId, parsed)
        }
      }
    } catch { toast.error('Erro ao sincronizar dados') }
  }, [])

  const saveUserData = async (userId: string, newData: AppData) => {
    setIsSyncing(true)
    try {
      const { error } = await (supabase as any).from('user_data').upsert({
        id: userId, data: newData as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString()
      })
      if (error) throw error
      localStorage.setItem('gestao_salario_v2', JSON.stringify(newData))
    } catch { toast.error('Erro ao salvar dados') } finally { setIsSyncing(false) }
  }

  useEffect(() => {
    if (isAuthenticated && state.auth.user) {
      fetchUserData(state.auth.user.id)
    }
  }, [isAuthenticated, state.auth.user, fetchUserData])

  const updateData = (updater: (d: AppData) => AppData) => {
    const newData = updater(data)
    setData(newData)
    if (state.auth.user) saveUserData(state.auth.user.id, newData)
  }

  const openMonth = (key: string) => {
    setCurrentMonth(key)
    setCurrentPage('mes')
    setCurrentTab('resumo')
  }

  const addMonth = () => {
    const val = newMonthInput.trim()
    if (!val) return
    if (data.months.includes(val)) { toast.error('Mês já existe!'); return }
    const newData = {
      ...data, months: [...data.months, val],
      mesData: { ...data.mesData, [val]: defaultMesData() },
    }
    setData(newData)
    if (state.auth.user) saveUserData(state.auth.user.id, newData)
    setNewMonthInput('')
    openMonth(val)
  }

  const deleteMonth = (e: React.MouseEvent, key: string) => {
    e.stopPropagation()
    if (!confirm(`Excluir ${key}?`)) return
    const newMonths = data.months.filter(m => m !== key)
    const newMesData = { ...data.mesData }
    delete newMesData[key]
    const newData = { ...data, months: newMonths, mesData: newMesData }
    setData(newData)
    if (state.auth.user) saveUserData(state.auth.user.id, newData)
    if (currentMonth === key) {
      setCurrentMonth(newMonths[newMonths.length - 1] || null)
      setCurrentPage('overview')
    }
  }

  if (!initialized) return <Splash />

  if (!isAuthenticated) {
    if (showLanding) return (
      <>
        <LandingPage onGetStarted={() => setShowLanding(false)} />
        <Toaster richColors position="top-right" />
      </>
    )
    return (
      <>
        <LoginPage onLoginSuccess={async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) fetchUserData(session.user.id)
        }} />
        <Toaster richColors position="top-right" />
      </>
    )
  }

  // ── RENDER NEW PAGES ──
  const isNewPage = ['transactions','metas_new','analytics_new','settings_new'].includes(currentPage)
  const isDashNew = currentPage === 'dashboard_new'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0b0c14', color: '#fff', fontFamily: 'inherit' }}>
      <Toaster richColors position="top-right" />

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarCollapsed ? 64 : 240, flexShrink: 0,
        background: '#0f1117', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0 }}>N</div>
          {!sidebarCollapsed && <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>NAVEX</p>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>FINANCE</p>
          </div>}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px', scrollbarWidth: 'none' }}>
          {/* Main nav */}
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', padding: '12px 8px 6px', display: sidebarCollapsed ? 'none' : 'block' }}>MENU PRINCIPAL</p>
          {[
            { id: 'overview',      Icon: LayoutGrid,    label: 'Painel Geral' },
            { id: 'transactions',  Icon: ArrowLeftRight, label: 'Transações' },
            { id: 'metas_new',     Icon: Target,         label: 'Metas' },
            { id: 'historico',     Icon: TrendingUp,     label: 'Análises' },
            { id: 'analytics_new', Icon: BarChart2,      label: 'Analytics Pro' },
          ].map(({ id, Icon, label }) => {
            const active = currentPage === id
            return (
              <button key={id} onClick={() => setCurrentPage(id)}
                title={sidebarCollapsed ? label : undefined}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 10, padding: sidebarCollapsed ? '10px 0' : '10px 12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2,
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{label}</span>}
              </button>
            )
          })}

          {/* Monthly planning */}
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', padding: '16px 8px 6px', display: sidebarCollapsed ? 'none' : 'block' }}>PLANEJAMENTO</p>
          <div style={{ maxHeight: 280, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {data.months.map(m => {
              const active = m === currentMonth && currentPage === 'mes'
              return (
                <button key={m} onClick={() => openMonth(m)}
                  title={sidebarCollapsed ? m : undefined}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 10, padding: sidebarCollapsed ? '8px 0' : '8px 12px',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2,
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: active ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
                    fontSize: 13, transition: 'all 0.15s', position: 'relative',
                  }}>
                  <Calendar size={16} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <>
                    <span style={{ flex: 1, textAlign: 'left', fontSize: 12 }}>{m}</span>
                    <span
                      onClick={(e) => deleteMonth(e, m)}
                      style={{ opacity: 0, fontSize: 12, color: '#f87171', padding: '2px 6px', borderRadius: 6, background: 'rgba(239,68,68,0.1)' }}
                      onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                      onMouseOut={e => (e.currentTarget.style.opacity = '0')}>
                      ✕
                    </span>
                  </>}
                </button>
              )
            })}
          </div>

          {/* Add month */}
          {!sidebarCollapsed && (
            <div style={{ padding: '8px 4px', marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  style={{ ...inp, fontSize: 12, padding: '8px 10px', flex: 1 }}
                  placeholder="Novo mês (Ex: Jul/25)"
                  value={newMonthInput}
                  onChange={e => setNewMonthInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMonth()}
                />
                <button onClick={addMonth}
                  style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Account */}
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', padding: '12px 8px 6px', display: sidebarCollapsed ? 'none' : 'block' }}>CONTA</p>
          {[
            { id: 'perfil',       Icon: User,     label: 'Meu Perfil' },
            { id: 'settings_new', Icon: Settings,  label: 'Configurações' },
          ].map(({ id, Icon, label }) => {
            const active = currentPage === id
            return (
              <button key={id} onClick={() => setCurrentPage(id)}
                title={sidebarCollapsed ? label : undefined}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 10, padding: sidebarCollapsed ? '10px 0' : '10px 12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2,
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{label}</span>}
              </button>
            )
          })}
        </div>

        {/* User footer */}
        {!sidebarCollapsed && (
          <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {(state.auth.user?.email ?? 'U')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {state.auth.profile?.full_name || 'Usuário'}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {state.auth.user?.email}
                </p>
              </div>
              {isSyncing && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1s infinite' }} />}
              <button onClick={() => supabase.auth.signOut()}
                title="Sair"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, borderRadius: 6 }}>
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <header style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(11,12,20,0.9)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <button onClick={() => setSidebarCollapsed(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 18, padding: 4, borderRadius: 8 }}>
            ☰
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            {currentPage === 'overview' ? 'Painel Geral' :
             currentPage === 'mes' ? `Planejamento · ${currentMonth}` :
             currentPage === 'historico' ? 'Análises' :
             currentPage === 'transactions' ? 'Transações' :
             currentPage === 'metas_new' ? 'Metas' :
             currentPage === 'analytics_new' ? 'Analytics Pro' :
             currentPage === 'perfil' ? 'Meu Perfil' :
             currentPage === 'settings_new' ? 'Configurações' : ''}
          </span>
          <div style={{ flex: 1 }} />
          {isSyncing && <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 600 }}>Sincronizando...</span>}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          <Suspense fallback={<PageLoader />}>
            {currentPage === 'overview'      && <OverviewPage data={data} openMonth={openMonth} />}
            {currentPage === 'mes'           && currentMonth && <MesPage data={data} currentMonth={currentMonth} currentTab={currentTab} setCurrentTab={setCurrentTab} updateData={updateData} />}
            {currentPage === 'historico'     && <HistoricoPage data={data} openMonth={openMonth} />}
            {currentPage === 'transactions'  && <TransactionsPage />}
            {currentPage === 'metas_new'     && <GoalsPage />}
            {currentPage === 'analytics_new' && <AnalyticsPage />}
            {currentPage === 'perfil'        && <OldProfilePage />}
            {currentPage === 'settings_new'  && <SettingsPage />}
          </Suspense>
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  )
}

// ── SPLASH ───────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0c14' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 auto 16px' }}>N</div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Carregando...</p>
      </div>
    </div>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── STAT CARD ────────────────────────────────────────────────
function StatCard({ label, value, Icon, colorClass }: { label: string; value: string; Icon: React.ElementType; colorClass: 'green' | 'red' | 'purple' | 'blue' }) {
  const colors = {
    green:  { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   color: '#4ade80' },
    red:    { bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.2)',   color: '#f87171' },
    purple: { bg: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.2)',  color: '#a5b4fc' },
    blue:   { bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.2)',  color: '#60a5fa' },
  }[colorClass]
  return (
    <div style={{ ...card, background: colors.bg, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 14, right: 14, opacity: 0.2 }}>
        <Icon size={22} style={{ color: colors.color }} />
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.color }}>{value}</p>
    </div>
  )
}

// ── OVERVIEW PAGE (original) ─────────────────────────────────
function OverviewPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map(m => ({ mes: m, ...calcMonth(data, m) }))
  const totalRec = allCalc.reduce((s, m) => s + m.rec, 0)
  const totalPag = allCalc.reduce((s, m) => s + m.pagar, 0)
  const totalSaldo = totalRec - totalPag
  const lastMonth = allCalc[allCalc.length - 1] || { rec: 0, pagar: 0, saldo: 0 }

  const chartData = {
    labels: allCalc.map(m => m.mes),
    datasets: [
      { label: 'Entradas', data: allCalc.map(m => m.rec), borderColor: '#4ade80', backgroundColor: 'rgba(34,197,94,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#4ade80' },
      { label: 'Saídas', data: allCalc.map(m => m.pagar), borderColor: '#f87171', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#f87171' },
    ],
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, letterSpacing: '-0.3px' }}>Painel Geral</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Visão consolidada de todos os meses</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Recebido" value={fmt(totalRec)} Icon={ArrowUpCircle} colorClass="green" />
        <StatCard label="Total Pago" value={fmt(totalPag)} Icon={ArrowDownCircle} colorClass="red" />
        <StatCard label="Saldo Acumulado" value={fmt(totalSaldo)} Icon={Wallet} colorClass="purple" />
        <StatCard label="Último Mês" value={fmt(lastMonth.saldo)} Icon={Calendar} colorClass="blue" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={card}>
          <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600 }}>Evolução Financeira</p>
          <div style={{ height: 280 }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>Meses Recentes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allCalc.slice(-5).reverse().map(m => (
              <div key={m.mes} onClick={() => openMonth(m.mes)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
                onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600 }}>{m.mes}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Saldo: {fmt(m.saldo)}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MES PAGE (original) ──────────────────────────────────────
function MesPage({ data, currentMonth, currentTab, setCurrentTab, updateData }: { data: AppData; currentMonth: string; currentTab: string; setCurrentTab: (t: string) => void; updateData: (fn: (d: AppData) => AppData) => void }) {
  const calc = calcMonth(data, currentMonth)
  const tabs = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'receitas', label: 'Receitas' },
    { id: 'despesas', label: 'Despesas' },
    { id: 'graficos', label: 'Gráficos' },
  ]
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, letterSpacing: '-0.3px' }}>{currentMonth}</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Planejamento mensal detalhado</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: 'rgba(99,102,241,0.1)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.2)' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saldo</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: calc.saldo >= 0 ? '#4ade80' : '#f87171' }}>{fmt(calc.saldo)}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: 'rgba(59,130,246,0.1)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Economia</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#60a5fa' }}>{calc.rec ? ((calc.saldo / calc.rec) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setCurrentTab(t.id)}
            style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: currentTab === t.id ? 'rgba(99,102,241,0.25)' : 'transparent', color: currentTab === t.id ? '#a5b4fc' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>
      {currentTab === 'resumo'   && <ResumoTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />}
      {currentTab === 'receitas' && <ReceitasTab data={data} currentMonth={currentMonth} updateData={updateData} />}
      {currentTab === 'despesas' && <DespesasTab data={data} currentMonth={currentMonth} updateData={updateData} />}
      {currentTab === 'graficos' && <GraficosTab data={data} currentMonth={currentMonth} calc={calc} />}
    </div>
  )
}

function ResumoTab({ data, currentMonth, calc, updateData }: { data: AppData; currentMonth: string; calc: ReturnType<typeof calcMonth>; updateData: (fn: (d: AppData) => AppData) => void }) {
  const togglePago = (idx: number, val: boolean) => {
    updateData(d => {
      const nd = { ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: d.mesData[currentMonth].fixas.map((f, i) => i === idx ? { ...f, pago: val } : f) } } }
      return nd
    })
  }
  const m = data.mesData[currentMonth]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <StatCard label="Recebido" value={fmt(calc.rec)} Icon={ArrowUpCircle} colorClass="green" />
        <StatCard label="A Pagar" value={fmt(calc.pagar)} Icon={ArrowDownCircle} colorClass="red" />
        <StatCard label="Saldo Livre" value={fmt(calc.saldo)} Icon={Wallet} colorClass="purple" />
        <StatCard label="Gasto Diário" value={fmt(calc.saldo / 30)} Icon={TrendingUp} colorClass="blue" />
      </div>
      <div style={card}>
        <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Contas Pendentes</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Descrição', 'Valor', 'Vencimento', 'Pago'].map(h => (
                <th key={h} style={{ padding: '8px 12px', fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: h === 'Valor' || h === 'Vencimento' ? 'right' : h === 'Pago' ? 'center' : 'left', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.fixas.filter(f => n(f.val) > 0).map((f, i) => {
              const actualIdx = m.fixas.indexOf(f)
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: f.pago ? 0.4 : 1 }}>
                  <td style={{ padding: '12px', fontSize: 13, textDecoration: f.pago ? 'line-through' : 'none' }}>{f.desc}</td>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#f87171', textAlign: 'right' }}>{fmt(f.val)}</td>
                  <td style={{ padding: '12px', fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>{f.dia ? `Dia ${f.dia}` : '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <input type="checkbox" checked={f.pago} onChange={e => togglePago(actualIdx, e.target.checked)} style={{ width: 16, height: 16, accentColor: '#6366f1', cursor: 'pointer' }} />
                  </td>
                </tr>
              )
            })}
            {m.fixas.filter(f => n(f.val) > 0).length === 0 && (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Nenhuma conta pendente este mês 🎉</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReceitasTab({ data, currentMonth, updateData }: { data: AppData; currentMonth: string; updateData: (fn: (d: AppData) => AppData) => void }) {
  const m = data.mesData[currentMonth]
  const addReceita = () => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], receitas: [...d.mesData[currentMonth].receitas, { desc: 'Nova receita', val: 0 }] } } }))
  const updateReceita = (idx: number, field: 'desc' | 'val', value: string) => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], receitas: d.mesData[currentMonth].receitas.map((r, i) => i === idx ? { ...r, [field]: field === 'val' ? parseFloat(value) || 0 : value } : r) } } }))
  const deleteReceita = (idx: number) => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], receitas: d.mesData[currentMonth].receitas.filter((_, i) => i !== idx) } } }))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Entradas do mês</h3>
        <button onClick={addReceita} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Adicionar
        </button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Descrição', 'Valor (R$)', ''].map(h => <th key={h} style={{ padding: '8px 12px', fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: h === 'Valor (R$)' ? 'right' : 'left', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {m.receitas.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px 12px' }}><input value={r.desc} onChange={e => updateReceita(i, 'desc', e.target.value)} style={{ ...inp, width: 'auto', padding: '6px 8px', fontSize: 13 }} /></td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}><input type="number" value={r.val || ''} onChange={e => updateReceita(i, 'val', e.target.value)} style={{ ...inp, width: 120, padding: '6px 8px', fontSize: 13, fontWeight: 600, color: '#4ade80', textAlign: 'right' }} /></td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}><button onClick={() => deleteReceita(i)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, color: '#f87171', cursor: 'pointer', padding: '6px 8px' }}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DespesasTab({ data, currentMonth, updateData }: { data: AppData; currentMonth: string; updateData: (fn: (d: AppData) => AppData) => void }) {
  const m = data.mesData[currentMonth]
  const addFixa = () => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: [...d.mesData[currentMonth].fixas, { desc: 'Nova fixa', dia: '', val: 0, pago: false }] } } }))
  const addVariavel = () => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], variaveis: [...d.mesData[currentMonth].variaveis, { desc: 'Nova variável', val: 0 }] } } }))
  const updateFixa = (idx: number, field: string, value: string) => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: d.mesData[currentMonth].fixas.map((f, i) => i === idx ? { ...f, [field]: field === 'val' ? parseFloat(value) || 0 : value } : f) } } }))
  const updateVariavel = (idx: number, field: string, value: string) => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], variaveis: d.mesData[currentMonth].variaveis.map((v, i) => i === idx ? { ...v, [field]: field === 'val' ? parseFloat(value) || 0 : value } : v) } } }))
  const deleteFixa = (idx: number) => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: d.mesData[currentMonth].fixas.filter((_, i) => i !== idx) } } }))
  const deleteVariavel = (idx: number) => updateData(d => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], variaveis: d.mesData[currentMonth].variaveis.filter((_, i) => i !== idx) } } }))

  const tblStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
  const thStyle = (align?: string): React.CSSProperties => ({ padding: '8px 10px', fontSize: 10, color: 'rgba(255,255,255,0.35)', textAlign: (align as any) ?? 'left', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' })
  const tdStyle: React.CSSProperties = { padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Custos Fixos</h3>
          <button onClick={addFixa} style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Plus size={13} /> Fixa</button>
        </div>
        <div style={card}>
          <table style={tblStyle}>
            <thead><tr><th style={thStyle()}>Desc</th><th style={thStyle('right')}>Dia</th><th style={thStyle('right')}>Valor</th><th style={thStyle('center')} /></tr></thead>
            <tbody>
              {m.fixas.map((f, i) => (
                <tr key={i}>
                  <td style={tdStyle}><input value={f.desc} onChange={e => updateFixa(i, 'desc', e.target.value)} style={{ ...inp, padding: '5px 7px', fontSize: 12 }} /></td>
                  <td style={tdStyle}><input value={f.dia} onChange={e => updateFixa(i, 'dia', e.target.value)} style={{ ...inp, width: 50, padding: '5px 7px', fontSize: 12, textAlign: 'center' }} /></td>
                  <td style={tdStyle}><input type="number" value={f.val || ''} onChange={e => updateFixa(i, 'val', e.target.value)} style={{ ...inp, width: 90, padding: '5px 7px', fontSize: 12, color: '#f87171', fontWeight: 600, textAlign: 'right' }} /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><button onClick={() => deleteFixa(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }}><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Custos Variáveis</h3>
          <button onClick={addVariavel} style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Plus size={13} /> Variável</button>
        </div>
        <div style={card}>
          <table style={tblStyle}>
            <thead><tr><th style={thStyle()}>Desc</th><th style={thStyle('right')}>Valor</th><th style={thStyle('center')} /></tr></thead>
            <tbody>
              {m.variaveis.map((v, i) => (
                <tr key={i}>
                  <td style={tdStyle}><input value={v.desc} onChange={e => updateVariavel(i, 'desc', e.target.value)} style={{ ...inp, padding: '5px 7px', fontSize: 12 }} /></td>
                  <td style={tdStyle}><input type="number" value={v.val || ''} onChange={e => updateVariavel(i, 'val', e.target.value)} style={{ ...inp, width: 90, padding: '5px 7px', fontSize: 12, color: '#f87171', fontWeight: 600, textAlign: 'right' }} /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><button onClick={() => deleteVariavel(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }}><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function GraficosTab({ data, currentMonth, calc }: { data: AppData; currentMonth: string; calc: ReturnType<typeof calcMonth> }) {
  const m = data.mesData[currentMonth]
  const fixas = m.fixas.reduce((s, r) => s + n(r.val), 0)
  const variaveis = m.variaveis.reduce((s, r) => s + n(r.val), 0)
  const doughnutData = {
    labels: ['Custos Fixos', 'Custos Variáveis', 'Saldo Livre'],
    datasets: [{ data: [fixas, variaveis, Math.max(0, calc.saldo)], backgroundColor: ['#f87171', '#60a5fa', '#4ade80'], borderWidth: 0, hoverOffset: 10 }],
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 20, color: '#fff' } } } }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: 'Fixos', value: fixas, color: '#f87171' },
          { label: 'Variáveis', value: variaveis, color: '#60a5fa' },
          { label: 'Saldo', value: calc.saldo, color: '#4ade80' },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', ...card }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: row.color }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{fmt(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoricoPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map(m => ({ mes: m, ...calcMonth(data, m) })).reverse()
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 700 }}>Histórico de Fluxo</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allCalc.map(m => (
          <div key={m.mes} onClick={() => openMonth(m.mes)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', ...card, cursor: 'pointer', transition: 'all 0.15s', flexWrap: 'wrap', gap: 14 }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#a5b4fc', fontSize: 13 }}>
                {m.mes.split('/')[0]}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700 }}>{m.mes}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Economia: {m.rec ? ((m.saldo / m.rec) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Entradas</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#4ade80' }}>{fmt(m.rec)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saídas</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f87171' }}>{fmt(m.pagar)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saldo</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: m.saldo >= 0 ? '#4ade80' : '#f87171' }}>{fmt(m.saldo)}</p>
              </div>
              <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── OLD PROFILE (com avatar upload) ─────────────────────────
function OldProfilePage() {
  const { user, profile, updateProfile } = useAuth() as any
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ full_name: fullName })
      toast.success('Perfil atualizado!')
    } catch { toast.error('Erro ao salvar') } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 700 }}>Meu Perfil</h1>
      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, flexShrink: 0 }}>
            {(fullName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 600 }}>{fullName || 'Usuário'}</p>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{user?.email}</p>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Nome completo</label>
          <input style={inp} value={fullName} placeholder="Seu nome" onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Email</label>
          <input style={{ ...inp, opacity: 0.5 }} value={user?.email ?? ''} disabled />
        </div>
        <button onClick={handleSave} disabled={loading}
          style={{ padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button onClick={() => supabase.auth.signOut()}
          style={{ padding: '11px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 14, cursor: 'pointer' }}>
          Sair da conta
        </button>
      </div>
    </div>
  )
}

// ── ROOT ─────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}
