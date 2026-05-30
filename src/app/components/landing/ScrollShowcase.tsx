import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  LayoutGrid, TrendingUp, Target, Wallet,
  ArrowUpCircle, ArrowDownCircle, Calendar,
  ChevronRight, Plus, User, LogOut,
} from 'lucide-react';

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────
// Reproduz a UI real do NAVEX Finance como componente estático

function StatCard({
  label, value, color, Icon,
}: {
  label: string; value: string; color: string; Icon: React.ElementType;
}) {
  return (
    <div className="bg-[#1a1a1e] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function MiniChart() {
  const bars = [30, 55, 40, 70, 50, 85, 60, 90, 72, 95, 78, 100];
  const line = [40, 60, 45, 75, 55, 80, 65, 88, 70, 92, 80, 96];
  return (
    <div className="relative h-20 flex items-end gap-1">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col-reverse">
          <div
            className="bg-accent-purple/35 rounded-t-sm"
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
      {/* Line overlay */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 120 40"
        preserveAspectRatio="none"
      >
        <polyline
          points={line.map((v, i) => `${(i / (line.length - 1)) * 120},${40 - (v / 100) * 40}`).join(' ')}
          fill="none"
          stroke="rgba(124,58,237,0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={`0,${40 - (line[0] / 100) * 40} ${line.map((v, i) => `${(i / (line.length - 1)) * 120},${40 - (v / 100) * 40}`).join(' ')} 120,40 0,40`}
          fill="rgba(124,58,237,0.06)"
          stroke="none"
        />
      </svg>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="w-full h-full bg-[#111114] flex text-white overflow-hidden rounded-b-2xl select-none">

      {/* Sidebar */}
      <div className="w-40 shrink-0 bg-[#161618] border-r border-white/10 flex flex-col py-4 px-3 gap-4">
        <div className="flex flex-col items-center gap-2 pb-3 border-b border-white/10">
          <img src="/logobranca.svg" alt="NAVEX" className="w-12 h-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        </div>

        {/* Menu */}
        <div className="space-y-0.5">
          <p className="text-[7px] font-black text-white/40 tracking-widest uppercase px-2 mb-1">Menu</p>
          {[
            { label: 'Painel Geral', icon: LayoutGrid, active: true },
            { label: 'Análises', icon: TrendingUp, active: false },
            { label: 'Metas', icon: Target, active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-bold ${
                item.active ? 'bg-accent-purple/15 text-accent-purple' : 'text-white/45'
              }`}
            >
              <item.icon size={11} />
              {item.label}
            </div>
          ))}
        </div>

        {/* Months */}
        <div className="space-y-0.5 flex-1">
          <p className="text-[7px] font-black text-white/40 tracking-widest uppercase px-2 mb-1">Planejamento</p>
          {['Jun/2025', 'Mai/2025', 'Abr/2025'].map((m) => (
            <div key={m} className="flex items-center gap-2 px-2 py-1 rounded-lg text-[8px] text-white/50">
              <Calendar size={9} />
              {m}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="h-6 bg-white/5 border border-white/10 rounded-lg flex items-center px-2">
            <span className="text-[7px] text-white/40 flex items-center gap-1">
              <Plus size={7} /> Novo mês
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-1">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <User size={8} className="text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-1.5 w-12 bg-white/20 rounded-full mb-0.5" />
              <div className="h-1 w-16 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#111114]/80">
          <div>
            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Painel Geral</p>
          </div>
          <button className="p-1 rounded-lg text-white/20">
            <LogOut size={10} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden space-y-3">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2">
            <StatCard label="Recebido" value="R$ 12.450" color="bg-blue-500/10 text-blue-400" Icon={ArrowUpCircle} />
            <StatCard label="Pago" value="R$ 5.820" color="bg-red-500/10 text-red-400" Icon={ArrowDownCircle} />
            <StatCard label="Saldo" value="R$ 6.630" color="bg-accent-purple/10 text-accent-purple" Icon={Wallet} />
            <StatCard label="Último Mês" value="R$ 1.800" color="bg-white/5 text-white/40" Icon={Calendar} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Main chart */}
            <div className="col-span-2 bg-[#1a1a1e] border border-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[9px] font-bold text-white/80">Evolução Financeira</p>
                <div className="flex gap-2 text-[7px] font-bold">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accent-purple inline-block" /> Entradas</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Saídas</span>
                </div>
              </div>
              <MiniChart />
            </div>

            {/* Recent months */}
            <div className="bg-[#1a1a1e] border border-white/10 rounded-2xl p-3">
              <p className="text-[9px] font-bold text-white/80 mb-2">Meses Recentes</p>
              <div className="space-y-1.5">
                {[
                  { mes: 'Jun/2025', saldo: 'R$ 1.800' },
                  { mes: 'Mai/2025', saldo: 'R$ 2.100' },
                  { mes: 'Abr/2025', saldo: 'R$ 1.560' },
                ].map((m) => (
                  <div key={m.mes} className="flex items-center justify-between p-1.5 rounded-lg bg-[#111114] border border-white/10">
                    <p className="text-[8px] font-bold text-white/70">{m.mes}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-[7px] text-accent-purple font-bold">{m.saldo}</p>
                      <ChevronRight size={8} className="text-white/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending bills */}
          <div className="bg-[#1a1a1e] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
              <p className="text-[8px] font-black text-white/60 uppercase tracking-widest">Contas Pendentes</p>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { desc: 'Aluguel / Financiamento', val: 'R$ 1.200,00', dia: 'Dia 5', pago: false },
                { desc: 'Energia Elétrica', val: 'R$ 245,50', dia: 'Dia 10', pago: true },
                { desc: 'Internet', val: 'R$ 109,90', dia: 'Dia 10', pago: true },
              ].map((bill) => (
                <div key={bill.desc} className={`flex items-center justify-between px-3 py-1.5 ${bill.pago ? 'opacity-50' : ''}`}>
                  <p className={`text-[8px] font-medium ${bill.pago ? 'line-through text-white/40' : 'text-white/85'}`}>{bill.desc}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-[7px] text-white/40">{bill.dia}</p>
                    <p className={`text-[8px] font-bold ${bill.pago ? 'line-through text-white/35' : 'text-red-400'}`}>{bill.val}</p>
                    <div className={`w-3 h-3 rounded border ${bill.pago ? 'bg-accent-purple border-accent-purple' : 'border-white/20'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Browser Frame ─────────────────────────────────────────────────────────────

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_80px_rgba(139,92,246,0.15),0_40px_80px_rgba(0,0,0,0.7)]">
      {/* Browser chrome */}
      <div className="bg-[#1c1c20] border-b border-white/10 px-4 py-3 flex items-center gap-3">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        {/* URL bar */}
        <div className="flex-1 mx-4 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400/70" />
          <span className="text-[10px] text-white/45 font-medium">navexfinance.vercel.app</span>
        </div>
        {/* Controls */}
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded bg-white/8" />
          ))}
        </div>
      </div>
      {/* Screen content */}
      <div className="aspect-[16/9] relative">
        {children}
      </div>
    </div>
  );
}

// ─── Scroll Showcase Section ──────────────────────────────────────────────────

export function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Headline sai suavemente
  const headlineY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Frame: visível desde o início, escala e sobe suavemente
  const frameScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1.0]);
  const frameY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.06], [0.75, 1]);

  // Floating badges aparecem na segunda metade
  const floatOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);
  const floatY = useTransform(scrollYProgress, [0.4, 0.65], [16, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[280vh] bg-[#0d0d0d]"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-accent-purple/15 rounded-full blur-[120px]" />
        </div>

        {/* Headline */}
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="absolute top-16 text-center z-20 px-4"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent-purple mb-4">
            Dashboard
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Veja sua vida financeira<br />
            <span className="text-white/40 italic">organizada</span>
          </h2>
          <p className="mt-4 text-white/40 text-base max-w-md mx-auto font-medium">
            Tudo que você precisa para entender e controlar seu dinheiro.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-sm">
            <span>Role para explorar</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>

        {/* Browser frame */}
        <motion.div
          style={{
            scale: frameScale,
            y: frameY,
            opacity: frameOpacity,
          }}
          className="w-full max-w-[1200px] mx-auto px-4 relative z-10"
        >
          <BrowserFrame>
            <DashboardMockup />
          </BrowserFrame>

          {/* Floating stat badges */}
          <motion.div
            style={{ opacity: floatOpacity, y: floatY }}
            className="absolute -left-4 top-20 bg-[#111214]/95 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md shadow-xl hidden lg:block"
          >
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Saldo Acumulado</p>
            <p className="text-xl font-black text-white">R$ 6.630</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-green-400 font-bold">↑ +12%</span>
              <span className="text-[10px] text-white/30">vs mês anterior</span>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: floatOpacity, y: floatY }}
            className="absolute -right-4 top-1/3 bg-[#111214]/95 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md shadow-xl hidden lg:block"
          >
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Taxa de Economia</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-accent-purple">32%</span>
              <span className="text-[10px] text-white/30">do salário</span>
            </div>
            <div className="mt-2 w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent-purple rounded-full" style={{ width: '32%' }} />
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: floatOpacity, y: floatY }}
            className="absolute -left-2 bottom-8 bg-[#111214]/95 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md shadow-xl hidden lg:block"
          >
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Meses Registrados</p>
            <div className="flex items-end gap-0.5 mt-2">
              {[40, 60, 50, 80, 65, 90].map((h, i) => (
                <div key={i} className="w-2 rounded-sm bg-accent-purple/50" style={{ height: `${h * 0.3}px` }} />
              ))}
            </div>
            <p className="text-lg font-black text-white mt-1">14 meses</p>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}
