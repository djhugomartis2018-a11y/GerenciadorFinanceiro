'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { LayoutGrid, TrendingUp, Target, User, Plus, Trash2, LogOut, ChevronRight, Wallet, ArrowUpCircle, ArrowDownCircle, Calendar, Lock, CreditCard, Layers } from 'lucide-react';
import { supabase, supabaseUrl } from '../lib/supabase';
import { useSubscription } from '../lib/useSubscription';
import { canAddMonth, hasFeature, PLAN_NAMES, Plan } from '../lib/plans';
import { BillingCycle, SubscriptionStatus, STRIPE_PRICE_IDS } from '../lib/pricingConfig';
import { SubscriptionContext } from '../context/SubscriptionContext';
import { UpgradeGate } from './components/ui/UpgradeGate';
import { ManagePlanPage } from './components/billing/ManagePlanPage';
import { ParcelamentosPage } from './components/billing/ParcelamentosPage';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { Toaster, toast } from 'sonner';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInput,
} from './components/ui/sidebar';
import { useIsMobile } from './components/ui/use-mobile';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/ui/table';
import { ScrollArea } from './components/ui/scroll-area';
import { Card as ShadcnCard, CardContent, CardHeader, CardTitle } from './components/ui/card';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

// Configure Chart.js defaults
ChartJS.defaults.color = '#999999';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1a1a1a';
ChartJS.defaults.plugins.tooltip.titleColor = '#fff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#00ff41';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

// Types
interface Receita {
  desc: string;
  val: number;
}

interface Fixa {
  desc: string;
  dia: string | number;
  val: number;
  pago: boolean;
}

interface Variavel {
  desc: string;
  val: number;
}

interface MesData {
  receitas: Receita[];
  fixas: Fixa[];
  variaveis: Variavel[];
}

interface Meta {
  desc: string;
  total: number;
  guardei: number;
}

export interface Parcelamento {
  id: string;
  desc: string;
  valorParcela: number;
  totalParcelas: number;
  parcelasPagas: number;
}

interface AppData {
  months: string[];
  mesData: Record<string, MesData>;
  metas: Meta[];
  parcelamentos: Parcelamento[];
}

const defaultMesData = (): MesData => ({
  receitas: [
    { desc: 'Salário principal', val: 0 },
    { desc: 'Renda extra', val: 0 }
  ],
  fixas: [
    { desc: 'Aluguel / Financiamento', dia: 5, val: 0, pago: false },
    { desc: 'Energia elétrica', dia: 10, val: 0, pago: false },
    { desc: 'Água', dia: 15, val: 0, pago: false },
    { desc: 'Internet', dia: 10, val: 0, pago: false },
    { desc: 'Mercado', dia: '', val: 0, pago: false }
  ],
  variaveis: []
});

const defaultMetas = (): Meta[] => [
  { desc: 'Reserva de Emergência', total: 0, guardei: 0 },
  { desc: 'Viagem dos Sonhos', total: 0, guardei: 0 }
];

const getDefaultData = (): AppData => ({
  months: ['Jan/2024', 'Fev/2024'],
  mesData: {
    'Jan/2024': {
      receitas: [{ desc: 'Salário', val: 5000 }],
      fixas: [
        { desc: 'Aluguel', dia: 5, val: 1200, pago: true },
        { desc: 'Internet', dia: 10, val: 100, pago: true }
      ],
      variaveis: [{ desc: 'Lazer', val: 800 }]
    },
    'Fev/2024': {
      receitas: [{ desc: 'Salário', val: 5200 }],
      fixas: [
        { desc: 'Aluguel', dia: 5, val: 1200, pago: false },
        { desc: 'Internet', dia: 10, val: 100, pago: false }
      ],
      variaveis: [{ desc: 'Restaurante', val: 400 }]
    }
  },
  metas: defaultMetas(),
  parcelamentos: []
});

const fmt = (v: number) =>
  'R$ ' +
  (v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
const n = (v: any) => parseFloat(v) || 0;

const calcMonth = (data: AppData, key: string) => {
  const m = data.mesData[key];
  if (!m) return { rec: 0, fixas: 0, variaveis: 0, pagar: 0, saldo: 0 };
  const rec = m.receitas.reduce((s, r) => s + n(r.val), 0);
  const fixas = m.fixas.reduce((s, r) => s + n(r.val), 0);
  const variaveis = m.variaveis.reduce((s, r) => s + n(r.val), 0);
  const pagar = fixas + variaveis;
  return { rec, fixas, variaveis, pagar, saldo: rec - pagar };
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [data, setData] = useState<AppData>(getDefaultData());
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [currentMonth, setCurrentMonth] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('resumo');
  const [newMonthInput, setNewMonthInput] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [showMonthLimitModal, setShowMonthLimitModal] = useState(false);
  const isMobile = useIsMobile();

  // ─── Subscription state ──────────────────────────────────────────────────
  const { plan: supabasePlan } = useSubscription(session?.user?.id ?? null);
  const [plan, setPlan] = useState<Plan>('basic');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('active');
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => { setPlan(supabasePlan); }, [supabasePlan]);

  async function subscribe(newPlan: Plan, cycle: BillingCycle) {
    if (newPlan === 'basic') return;
    setBillingLoading(true);
    try {
      const priceId = STRIPE_PRICE_IDS[newPlan][cycle];
      const { data: { session: authSession } } = await supabase.auth.getSession();
      const res = await fetch(
        `${supabaseUrl}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authSession?.access_token}`,
          },
          body: JSON.stringify({ priceId }),
        }
      );
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error('Stripe checkout error:', err);
      toast.error('Erro ao iniciar pagamento. Tente novamente.');
      setBillingLoading(false);
    }
  }

  async function cancelSubscription() {
    setBillingLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setPlan('basic');
    setSubscriptionStatus('canceled');
    setBillingLoading(false);
  }

  const subscriptionContextValue = {
    plan,
    billingCycle,
    status: subscriptionStatus,
    isLoading: billingLoading,
    subscribe,
    cancel: cancelSubscription,
  };

  // Load data from Supabase
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data: dbData, error } = await supabase
        .from('user_data')
        .select('data')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (dbData?.data) {
        setData(dbData.data);
        const months = dbData.data.months;
        if (months.length > 0) {
          setCurrentMonth(months[months.length - 1]);
        }
      } else {
        // Novo usuário — começa com dados limpos, ignora localStorage de outros usuários
        const freshData = getDefaultData();
        setData(freshData);
        localStorage.removeItem('gestao_salario_v2');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Erro ao sincronizar dados');
    }
  }, []);

  // Save data to Supabase
  const saveUserData = async (userId: string, newData: AppData) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({ 
          id: userId, 
          data: newData, 
          updated_at: new Date().toISOString() 
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving data:', err);
      toast.error('Erro ao salvar dados na nuvem');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Detecta redirect após confirmação de e-mail
    const hash = window.location.hash;
    if (hash.includes('type=signup') || hash.includes('type=email_change')) {
      setEmailConfirmed(true);
      supabase.auth.signOut().then(() => {
        window.history.replaceState(null, '', window.location.pathname);
        setAuthLoading(false);
      });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserData(session.user.id);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserData(session.user.id);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const showPage = (name: string) => {
    setCurrentPage(name);
  };

  const addParcelamento = (p: Omit<Parcelamento, 'id'>) => {
    const newData = { ...data, parcelamentos: [...(data.parcelamentos ?? []), { ...p, id: crypto.randomUUID() }] };
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
  };

  const pagarParcela = (id: string) => {
    const newData = {
      ...data,
      parcelamentos: (data.parcelamentos ?? []).map(p =>
        p.id === id ? { ...p, parcelasPagas: Math.min(p.parcelasPagas + 1, p.totalParcelas) } : p
      )
    };
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
  };

  const desfazerParcela = (id: string) => {
    const newData = {
      ...data,
      parcelamentos: (data.parcelamentos ?? []).map(p =>
        p.id === id ? { ...p, parcelasPagas: Math.max(p.parcelasPagas - 1, 0) } : p
      )
    };
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
  };

  const deleteParcelamento = (id: string) => {
    const newData = { ...data, parcelamentos: (data.parcelamentos ?? []).filter(p => p.id !== id) };
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
  };

  const openMonth = (key: string) => {
    setCurrentMonth(key);
    setCurrentPage('mes');
    setCurrentTab('resumo');
  };

  const addMonth = () => {
    const val = newMonthInput.trim();
    if (!val) return;
    if (data.months.includes(val)) {
      toast.error('Mês já existe!');
      return;
    }
    if (!canAddMonth(plan, data.months.length)) {
      setShowMonthLimitModal(true);
      return;
    }
    const newData = {
      ...data,
      months: [...data.months, val],
      mesData: { ...data.mesData, [val]: defaultMesData() }
    };
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
    setNewMonthInput('');
    setCurrentMonth(val);
    setCurrentPage('mes');
  };

  const deleteMonth = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (!confirm(`Excluir ${key}?`)) return;
    const newMonths = data.months.filter((m) => m !== key);
    const newMesData = { ...data.mesData };
    delete newMesData[key];
    const newData = { ...data, months: newMonths, mesData: newMesData };
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
    if (currentMonth === key) {
      setCurrentMonth(newMonths[newMonths.length - 1] || null);
      setCurrentPage('overview');
    }
  };

  const updateData = (updater: (d: AppData) => AppData) => {
    const newData = updater(data);
    setData(newData);
    if (session?.user) saveUserData(session.user.id, newData);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-4">💰</div>
          <div className="text-text-dim text-sm font-medium">Sincronizando...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    if (showLanding) {
      return (
        <>
          <LandingPage onGetStarted={() => setShowLanding(false)} />
          <Toaster richColors position="top-right" />
        </>
      );
    }
    return (
      <>
        <LoginPage
          emailConfirmed={emailConfirmed}
          onLoginSuccess={async () => {
            const { data: { session: newSession } } = await supabase.auth.getSession();
            setSession(newSession);
          }}
        />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <SubscriptionContext.Provider value={subscriptionContextValue}>
    <SidebarProvider>
      <Toaster richColors position="top-right" />
      <div className="flex w-full min-h-screen bg-background text-foreground selection:bg-accent-purple/30">
        <Sidebar className="border-r border-border" collapsible={isMobile ? "icon" : "none"}>
          <SidebarHeader className="px-6 py-8">
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-purple/20 blur-2xl rounded-full" />
                <img src="/logobranca.svg" alt="Logo" className="w-32 h-32 relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[10px] font-black text-text-dark tracking-widest mb-2">MENU PRINCIPAL</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentPage === 'overview'} onClick={() => showPage('overview')}>
                      <LayoutGrid size={20} className={currentPage === 'overview' ? "text-accent-purple" : ""} />
                      <span className="font-bold">Painel Geral</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentPage === 'historico'} onClick={() => showPage('historico')}>
                      <TrendingUp size={20} className={currentPage === 'historico' ? "text-accent-purple" : ""} />
                      <span className="font-bold">Análises</span>
                      {!hasFeature(plan, 'monthlyComparison') && <Lock size={12} className="ml-auto text-text-dark" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentPage === 'metas'} onClick={() => showPage('metas')}>
                      <Target size={20} className={currentPage === 'metas' ? "text-accent-purple" : ""} />
                      <span className="font-bold">Minhas Metas</span>
                      {!hasFeature(plan, 'financialGoals') && <Lock size={12} className="ml-auto text-text-dark" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentPage === 'parcelamentos'} onClick={() => showPage('parcelamentos')}>
                      <Layers size={20} className={currentPage === 'parcelamentos' ? "text-accent-purple" : ""} />
                      <span className="font-bold">Parcelamentos</span>
                      {!hasFeature(plan, 'parcelamentos') && <Lock size={12} className="ml-auto text-text-dark" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentPage === 'plano'} onClick={() => showPage('plano')}>
                      <CreditCard size={20} className={currentPage === 'plano' ? "text-accent-purple" : ""} />
                      <span className="font-bold">Meu Plano</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-3 text-[10px] font-black text-text-dark tracking-widest mb-2">PLANEJAMENTO</SidebarGroupLabel>
              <SidebarGroupContent>
                <ScrollArea className="h-[280px] pr-2">
                  <SidebarMenu>
                    {data.months.map((m: string) => (
                      <SidebarMenuItem key={m}>
                        <SidebarMenuButton 
                          isActive={m === currentMonth && currentPage === 'mes'} 
                          onClick={() => openMonth(m)}
                          className="group/month flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className={m === currentMonth ? "text-accent-purple" : "text-text-dark"} />
                            <span className="font-medium">{m}</span>
                          </div>
                          <button
                            onClick={(e) => deleteMonth(e, m)}
                            className="opacity-0 group-hover/month:opacity-100 p-1 hover:bg-red-500/10 rounded-md transition-all"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border bg-sidebar-accent/30">
            <div className="space-y-3">
              <div className="relative">
                <SidebarInput
                  type="text"
                  value={newMonthInput}
                  onChange={(e) => setNewMonthInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMonth()}
                  placeholder="Novo mês (Ex: Jul/25)"
                  className="bg-background border-border h-10 pr-10 font-medium"
                />
                <button onClick={addMonth} className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-purple hover:scale-110 transition-transform">
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group" onClick={() => showPage('perfil')}>
                <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center group-hover:border-accent-purple/50 transition-colors">
                  <User size={16} className="text-text-dim group-hover:text-accent-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Minha Conta</p>
                  <p className="text-[10px] text-text-dim truncate">{session.user.email}</p>
                </div>
                {isSyncing && <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" />}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text-dark">
                  {currentPage === 'overview' ? 'Painel Geral' :
                   currentPage === 'mes' ? `Planejamento · ${currentMonth}` :
                   currentPage === 'historico' ? 'Análise de Dados' :
                   currentPage === 'metas' ? 'Minhas Metas' :
                   currentPage === 'parcelamentos' ? 'Parcelamentos' :
                   currentPage === 'plano' ? 'Meu Plano' : 'Meu Perfil'}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isSyncing && <span className="text-[10px] font-bold text-accent-purple animate-pulse hidden md:block">SINCRONIZANDO...</span>}
              <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut()} className="text-text-dark hover:text-red-500">
                <LogOut size={18} />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {currentPage === 'overview' && <OverviewPage data={data} openMonth={openMonth} />}
            {currentPage === 'mes' && currentMonth && (
              <MesPage
                data={data}
                currentMonth={currentMonth}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                updateData={updateData}
              />
            )}
            {currentPage === 'historico' && (
              <UpgradeGate feature="monthlyComparison">
                <HistoricoPage data={data} openMonth={openMonth} />
              </UpgradeGate>
            )}
            {currentPage === 'metas' && (
              <UpgradeGate feature="financialGoals">
                <MetasPage data={data} updateData={updateData} />
              </UpgradeGate>
            )}
            {currentPage === 'parcelamentos' && (
              <UpgradeGate feature="parcelamentos">
                <ParcelamentosPage
                  parcelamentos={data.parcelamentos ?? []}
                  onAdd={addParcelamento}
                  onPagar={pagarParcela}
                  onDesfazer={desfazerParcela}
                  onDelete={deleteParcelamento}
                />
              </UpgradeGate>
            )}
            {currentPage === 'plano' && <ManagePlanPage />}
            {currentPage === 'perfil' && <ProfilePage />}
          </main>
        </SidebarInset>
      </div>

      {showMonthLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full mx-4 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-black">Torne sua organização contínua</h3>
              <p className="text-sm text-text-dim">
                Você atingiu o limite de {2} meses do plano {PLAN_NAMES[plan]}.
                Remova um mês existente ou evolua seu plano para continuar.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => { setShowMonthLimitModal(false); setCurrentPage('overview'); }}
                variant="outline"
                className="w-full border-border"
              >
                Remover um mês
              </Button>
              <Button
                onClick={() => { setShowMonthLimitModal(false); setShowLanding(true); }}
                className="w-full bg-accent-purple text-white hover:bg-accent-purple/90 font-bold"
              >
                Upgrade para Essencial
              </Button>
              <button
                onClick={() => setShowMonthLimitModal(false)}
                className="text-xs text-text-dim hover:text-foreground transition-colors text-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
    </SubscriptionContext.Provider>
  );
}

// COMPONENTES DE APOIO MELHORADOS
function StatCard({ label, value, icon: Icon, color, trend }: any) {
  const colors: any = {
    lime: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    blue: 'bg-blue-bg text-blue border-blue-bg',
    red: 'bg-red-bg text-red border-red-bg',
    dim: 'bg-surface text-text-dim border-border'
  };

  return (
    <ShadcnCard className="bg-surface border-border overflow-hidden hover:border-accent-purple/30 transition-all group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${colors[color] || colors.dim}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${trend > 0 ? 'bg-accent-purple/10 text-accent-purple' : 'bg-red-bg text-red'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-2xl font-black tracking-tight group-hover:translate-x-1 transition-transform">{value}</h3>
        </div>
      </CardContent>
    </ShadcnCard>
  );
}

// OVERVIEW PAGE
function OverviewPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map((m) => ({ mes: m, ...calcMonth(data, m) }));
  const totalRec = allCalc.reduce((s, m) => s + m.rec, 0);
  const totalPag = allCalc.reduce((s, m) => s + m.pagar, 0);
  const totalSaldo = totalRec - totalPag;
  
  const lastMonth = allCalc[allCalc.length - 1] || { rec: 0, pagar: 0, saldo: 0 };

  const chartData = {
    labels: allCalc.map((m) => m.mes),
    datasets: [
      {
        label: 'Entradas',
        data: allCalc.map((m) => m.rec),
        borderColor: '#00ff41',
        backgroundColor: 'rgba(0, 255, 65, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#00ff41'
      },
      {
        label: 'Saídas',
        data: allCalc.map((m) => m.pagar),
        borderColor: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ff4d4d'
      }
    ]
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Recebido" value={fmt(totalRec)} icon={ArrowUpCircle} color="blue" />
        <StatCard label="Total Pago" value={fmt(totalPag)} icon={ArrowDownCircle} color="red" />
        <StatCard label="Saldo Acumulado" value={fmt(totalSaldo)} icon={Wallet} color="lime" />
        <StatCard label="Último Mês" value={fmt(lastMonth.saldo)} icon={Calendar} color="dim" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ShadcnCard className="lg:col-span-2 bg-surface border-border p-6">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Evolução Financeira</CardTitle>
            <div className="flex gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-purple" /> ENTRADAS</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> SAÍDAS</div>
            </div>
          </CardHeader>
          <div className="h-[300px] mt-4">
            <Line 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { 
                  y: { grid: { color: 'rgba(255,255,255,0.03)' }, border: { display: false } },
                  x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </ShadcnCard>

        <ShadcnCard className="bg-surface border-border p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Meses Recentes</CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-4">
            {allCalc.slice(-5).reverse().map((m) => (
              <div 
                key={m.mes} 
                onClick={() => openMonth(m.mes)}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-accent-purple/30 cursor-pointer transition-all group"
              >
                <div>
                  <p className="text-sm font-bold">{m.mes}</p>
                  <p className="text-[10px] text-text-dim">Saldo: {fmt(m.saldo)}</p>
                </div>
                <ChevronRight size={16} className="text-text-dark group-hover:text-accent-purple group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </ShadcnCard>
      </div>
    </div>
  );
}

// MES PAGE
function MesPage({ data, currentMonth, currentTab, setCurrentTab, updateData }: any) {
  const calc = calcMonth(data, currentMonth);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">{currentMonth}</h2>
          <p className="text-text-dim font-medium mt-1">Gerenciamento detalhado do seu fluxo de caixa</p>
        </div>
        <div className="flex bg-surface p-1 rounded-xl border border-border">
          <div className="px-4 py-2 text-center border-r border-border">
            <p className="text-[10px] font-black text-text-dark uppercase tracking-widest">Saldo</p>
            <p className={`text-sm font-bold ${calc.saldo >= 0 ? 'text-accent-purple' : 'text-red-500'}`}>{fmt(calc.saldo)}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-black text-text-dark uppercase tracking-widest">Economia</p>
            <p className="text-sm font-bold text-blue">{calc.rec ? ((calc.saldo / calc.rec) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="bg-surface border border-border p-1 h-auto grid grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="resumo" className="py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-accent-purple">Resumo</TabsTrigger>
          <TabsTrigger value="receitas" className="py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-accent-purple">Receitas</TabsTrigger>
          <TabsTrigger value="despesas" className="py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-accent-purple">Despesas</TabsTrigger>
          <TabsTrigger value="graficos" className="py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-accent-purple">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-0">
          <ResumoTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />
        </TabsContent>
        <TabsContent value="receitas" className="mt-0">
          <ReceitasTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />
        </TabsContent>
        <TabsContent value="despesas" className="mt-0">
          <DespesasTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />
        </TabsContent>
        <TabsContent value="graficos" className="mt-0">
          <GraficosTab data={data} currentMonth={currentMonth} calc={calc} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// RESUMO TAB
function ResumoTab({ data, currentMonth, calc, updateData }: any) {
  const porDia = calc.saldo / 30;

  const togglePago = (idx: number, val: boolean) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].fixas[idx].pago = val;
      return newData;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Recebido" value={fmt(calc.rec)} icon={ArrowUpCircle} color="blue" />
        <StatCard label="A Pagar" value={fmt(calc.pagar)} icon={ArrowDownCircle} color="red" />
        <StatCard label="Saldo Livre" value={fmt(calc.saldo)} icon={Wallet} color="lime" />
        <StatCard label="Gasto Diário" value={fmt(porDia)} icon={TrendingUp} color="dim" />
      </div>

      <ShadcnCard className="bg-surface border-border overflow-hidden">
        <CardHeader className="border-b border-border bg-sidebar-accent/20 px-6 py-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
            Contas Pendentes
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-background/50">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-bold text-text-dark">Descrição</TableHead>
                <TableHead className="text-right font-bold text-text-dark">Valor</TableHead>
                <TableHead className="text-right font-bold text-text-dark">Vencimento</TableHead>
                <TableHead className="text-center font-bold text-text-dark">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.mesData[currentMonth].fixas
                .filter((f: Fixa) => n(f.val) > 0)
                .map((f: Fixa, i: number) => {
                  const actualIdx = data.mesData[currentMonth].fixas.indexOf(f);
                  return (
                    <TableRow key={i} className={`border-border transition-opacity ${f.pago ? 'opacity-40' : 'opacity-100'}`}>
                      <TableCell className={`font-medium ${f.pago ? 'line-through' : ''}`}>{f.desc}</TableCell>
                      <TableCell className={`text-right font-bold ${f.pago ? 'line-through' : 'text-red-400'}`}>{fmt(f.val)}</TableCell>
                      <TableCell className="text-right text-text-dim font-medium">{f.dia ? `Dia ${f.dia}` : '—'}</TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={f.pago}
                          onChange={(e) => togglePago(actualIdx, e.target.checked)}
                          className="w-5 h-5 rounded-md border-border bg-background checked:bg-accent-purple cursor-pointer transition-all accent-accent-purple"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {data.mesData[currentMonth].fixas.filter((f: Fixa) => n(f.val) > 0).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-text-dim font-medium">Nenhuma conta pendente este mês 🎉</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ShadcnCard>
    </div>
  );
}

// Outros componentes simplificados para brevidade, mas mantendo a lógica
function ReceitasTab({ data, currentMonth, updateData }: any) {
  const addReceita = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].receitas.push({ desc: 'Nova receita', val: 0 });
      return newData;
    });
  };

  const updateReceita = (idx: number, field: 'desc' | 'val', value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      if (field === 'val') newData.mesData[currentMonth].receitas[idx].val = parseFloat(value) || 0;
      else newData.mesData[currentMonth].receitas[idx].desc = value;
      return newData;
    });
  };

  const deleteReceita = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].receitas.splice(idx, 1);
      return newData;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Gestão de Entradas</h3>
        <Button onClick={addReceita} className="bg-accent-purple text-white hover:bg-accent-purple/90 font-bold">
          <Plus size={18} className="mr-2" /> Adicionar
        </Button>
      </div>
      <ShadcnCard className="bg-surface border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold">Descrição</TableHead>
              <TableHead className="text-right font-bold">Valor</TableHead>
              <TableHead className="text-center font-bold">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.mesData[currentMonth].receitas.map((r: Receita, i: number) => (
              <TableRow key={i} className="border-border">
                <TableCell>
                  <input
                    type="text"
                    value={r.desc}
                    onChange={(e) => updateReceita(i, 'desc', e.target.value)}
                    className="bg-transparent border-none text-foreground w-full focus:ring-1 focus:ring-accent-purple/30 rounded px-2 py-1 font-medium"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={r.val || ''}
                    onChange={(e) => updateReceita(i, 'val', e.target.value)}
                    className="bg-transparent border-none text-foreground text-right w-full focus:ring-1 focus:ring-accent-purple/30 rounded px-2 py-1 font-bold text-blue"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => deleteReceita(i)} className="text-red-500 hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShadcnCard>
    </div>
  );
}

function DespesasTab({ data, currentMonth, updateData }: any) {
  const addFixa = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].fixas.push({ desc: 'Nova fixa', dia: '', val: 0, pago: false });
      return newData;
    });
  };

  const addVariavel = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].variaveis.push({ desc: 'Nova variável', val: 0 });
      return newData;
    });
  };

  const updateFixa = (idx: number, field: any, value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      (newData.mesData[currentMonth].fixas[idx] as any)[field] = field === 'val' ? parseFloat(value) || 0 : value;
      return newData;
    });
  };

  const updateVariavel = (idx: number, field: any, value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      (newData.mesData[currentMonth].variaveis[idx] as any)[field] = field === 'val' ? parseFloat(value) || 0 : value;
      return newData;
    });
  };

  const deleteFixa = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].fixas.splice(idx, 1);
      return newData;
    });
  };

  const deleteVariavel = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].variaveis.splice(idx, 1);
      return newData;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Custos Fixos</h3>
          <Button onClick={addFixa} variant="outline" size="sm" className="border-border hover:border-accent-purple/50">
            <Plus size={16} className="mr-2" /> Fixa
          </Button>
        </div>
        <ShadcnCard className="bg-surface border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Desc</TableHead>
                <TableHead className="text-right">Dia</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.mesData[currentMonth].fixas.map((f: Fixa, i: number) => (
                <TableRow key={i} className="border-border">
                  <TableCell><input value={f.desc} onChange={e => updateFixa(i, 'desc', e.target.value)} className="bg-transparent border-none w-full text-xs font-medium" /></TableCell>
                  <TableCell><input value={f.dia} onChange={e => updateFixa(i, 'dia', e.target.value)} className="bg-transparent border-none w-full text-right text-xs" /></TableCell>
                  <TableCell><input type="number" value={f.val || ''} onChange={e => updateFixa(i, 'val', e.target.value)} className="bg-transparent border-none w-full text-right text-xs font-bold text-red-400" /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => deleteFixa(i)} className="h-6 w-6 text-red-500"><Trash2 size={12} /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShadcnCard>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Custos Variáveis</h3>
          <Button onClick={addVariavel} variant="outline" size="sm" className="border-border hover:border-accent-purple/50">
            <Plus size={16} className="mr-2" /> Variável
          </Button>
        </div>
        <ShadcnCard className="bg-surface border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Desc</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.mesData[currentMonth].variaveis.map((v: Variavel, i: number) => (
                <TableRow key={i} className="border-border">
                  <TableCell><input value={v.desc} onChange={e => updateVariavel(i, 'desc', e.target.value)} className="bg-transparent border-none w-full text-xs font-medium" /></TableCell>
                  <TableCell><input type="number" value={v.val || ''} onChange={e => updateVariavel(i, 'val', e.target.value)} className="bg-transparent border-none w-full text-right text-xs font-bold text-red-400" /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => deleteVariavel(i)} className="h-6 w-6 text-red-500"><Trash2 size={12} /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShadcnCard>
      </div>
    </div>
  );
}

function GraficosTab({ data, currentMonth, calc }: any) {
  const m = data.mesData[currentMonth];
  const fixas = m.fixas.reduce((s: number, r: any) => s + n(r.val), 0);
  const variaveis = m.variaveis.reduce((s: number, r: any) => s + n(r.val), 0);
  
  const doughnutData = {
    labels: ['Custos Fixos', 'Custos Variáveis', 'Saldo Livre'],
    datasets: [{
      data: [fixas, variaveis, Math.max(0, calc.saldo)],
      backgroundColor: ['#ff4d4d', '#3d91ff', '#00ff41'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="h-[300px] flex items-center justify-center">
        <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 20, font: { weight: 'bold' } } } } }} />
      </div>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-surface border border-border">
          <p className="text-[10px] font-black text-text-dark tracking-widest uppercase mb-1">Distribuição de Gastos</p>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Fixos</span>
              <span className="text-sm font-black">{fmt(fixas)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue" /> Variáveis</span>
              <span className="text-sm font-black">{fmt(variaveis)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent-purple" /> Saldo</span>
              <span className="text-sm font-black text-accent-purple">{fmt(calc.saldo)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HISTORICO PAGE
function HistoricoPage({ data, openMonth }: any) {
  const allCalc = data.months.map((m: string) => ({ mes: m, ...calcMonth(data, m) }));

  return (
    <div className="animate-fadeIn space-y-6">
      <h3 className="text-2xl font-black tracking-tight">Histórico de Fluxo</h3>
      <div className="grid grid-cols-1 gap-4">
        {allCalc.reverse().map((m: any) => (
          <div 
            key={m.mes} 
            onClick={() => openMonth(m.mes)}
            className="p-4 rounded-2xl bg-surface border border-border hover:border-accent-purple/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center font-black text-accent-purple">
                {m.mes.split('/')[0]}
              </div>
              <div>
                <p className="font-bold text-lg">{m.mes}</p>
                <p className="text-xs text-text-dim">Economia: {m.rec ? ((m.saldo / m.rec) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
            <div className="flex items-center gap-8 px-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-text-dark uppercase">Entradas</p>
                <p className="text-sm font-bold text-blue">{fmt(m.rec)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-text-dark uppercase">Saídas</p>
                <p className="text-sm font-bold text-red-400">{fmt(m.pagar)}</p>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="text-[10px] font-black text-text-dark uppercase">Saldo</p>
                <p className="text-sm font-black text-accent-purple">{fmt(m.saldo)}</p>
              </div>
              <ChevronRight size={20} className="text-text-dark group-hover:text-accent-purple group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// METAS PAGE
function MetasPage({ data, updateData }: any) {
  const addMeta = () => {
    updateData((d: AppData) => ({
      ...d,
      metas: [...d.metas, { desc: 'Nova Meta', total: 0, guardei: 0 }]
    }));
  };

  const updateMeta = (idx: number, field: string, value: any) => {
    updateData((d: AppData) => {
      const newMetas = [...d.metas];
      (newMetas[idx] as any)[field] = field === 'desc' ? value : parseFloat(value) || 0;
      return { ...d, metas: newMetas };
    });
  };

  const deleteMeta = (idx: number) => {
    updateData((d: AppData) => ({
      ...d,
      metas: d.metas.filter((_: any, i: number) => i !== idx)
    }));
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black tracking-tight">Metas Financeiras</h3>
        <Button onClick={addMeta} className="bg-accent-purple text-white hover:bg-accent-purple/90 font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          <Plus size={18} className="mr-2" /> Nova Meta
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.metas.map((m: Meta, i: number) => {
          const perc = m.total ? Math.min(100, (m.guardei / m.total) * 100) : 0;
          return (
            <ShadcnCard key={i} className="bg-surface border-border p-6 hover:border-accent-purple/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <input 
                  value={m.desc} 
                  onChange={e => updateMeta(i, 'desc', e.target.value)}
                  className="bg-transparent border-none text-xl font-black focus:ring-0 p-0 w-full"
                />
                <Button variant="ghost" size="icon" onClick={() => deleteMeta(i)} className="text-red-500 hover:bg-red-500/10 -mt-2">
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">Meta Total</p>
                    <input 
                      type="number" 
                      value={m.total || ''} 
                      onChange={e => updateMeta(i, 'total', e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-2 w-full font-bold text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">Já Guardado</p>
                    <input 
                      type="number" 
                      value={m.guardei || ''} 
                      onChange={e => updateMeta(i, 'guardei', e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-2 w-full font-bold text-sm text-accent-purple"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-text-dim">Progresso</span>
                    <span className="text-accent-purple">{perc.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-background rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full bg-accent-purple shadow-[0_0_15px_rgba(124,58,237,0.6)] transition-all duration-1000" 
                      style={{ width: `${perc}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-text-dark font-bold text-right">Faltam {fmt(Math.max(0, m.total - m.guardei))}</p>
                </div>
              </div>
            </ShadcnCard>
          );
        })}
      </div>
    </div>
  );
}
