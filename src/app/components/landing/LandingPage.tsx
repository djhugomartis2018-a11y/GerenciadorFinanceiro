import { useState } from 'react';
import { ChevronRight, TrendingUp, Target, Wallet, BarChart3, Lock, Zap, ArrowRight, Sparkles, CheckCircle2, PlayCircle, Globe, Layout, ShieldCheck, BarChart, Smartphone, LayoutGrid, User, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { PricingSection } from '../ui/pricing';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: BarChart3,
      title: 'Visualização de Dados',
      description: 'Visualize e organize conjuntos de dados complexos sem esforço para insights mais claros e decisões rápidas.',
      highlight: 'Insights Reais'
    },
    {
      icon: Smartphone,
      title: 'Acesso Mobile',
      description: 'Acesse seu dashboard financeiro de qualquer lugar com nosso app responsivo.',
      highlight: 'Mobile First'
    }
  ];

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Básico',
      price: '0',
      yearlyPrice: '0',
      period: 'mês',
      description: 'Perfeito para começar',
      features: [
        'Até 2 contas',
        '50 lançamentos/mês',
        'Visão mensal',
        'Suporte por email'
      ],
      buttonText: 'Começar',
      href: '#',
      isPopular: false
    },
    {
      id: 'essential',
      name: 'Essencial',
      price: '19',
      yearlyPrice: '15',
      period: 'mês',
      description: 'Mais controle, mais liberdade',
      features: [
        'Lançamentos ilimitados',
        'Categorias personalizadas',
        'Relatórios simples',
        'Exportação de dados',
        'Suporte prioritário'
      ],
      buttonText: 'Assinar',
      href: '#',
      isPopular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '39',
      yearlyPrice: '31',
      period: 'mês',
      description: 'Controle financeiro total',
      features: [
        'Metas financeiras avançadas',
        'Planejamento mensal',
        'Comparação de períodos',
        'Dashboard avançado',
        'Análise preditiva',
        'Suporte 24/7'
      ],
      buttonText: 'Assinar',
      href: '#',
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden selection:bg-accent-purple/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-purple/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-lime/5 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
        <div className="flex items-center gap-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center relative group">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/logobranca.svg" alt="NAVEX Finance" className="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#preços" className="hover:text-white transition-colors">Preços</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">Otimize seu Fluxo Financeiro</span>
          </div>

          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Eleve suas Finanças com<br />
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent italic">Automação com IA</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-medium">
              Uma plataforma inovadora que simplifica seu controle, aumenta sua eficiência e ajuda suas finanças a crescerem de forma organizada.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              onClick={onGetStarted}
              className="h-12 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-[#daeb44] hover:text-black hover:border-[#daeb44] hover:shadow-[0_0_30px_rgba(218,235,68,0.5)] text-sm font-bold backdrop-blur-sm transition-all duration-300 group"
            >
              Começar Agora <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              className="h-12 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-[#daeb44] hover:text-black hover:border-[#daeb44] hover:shadow-[0_0_30px_rgba(218,235,68,0.5)] text-sm font-bold backdrop-blur-sm transition-all duration-300 group"
            >
              Ver Demonstração <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative mt-20 max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-accent-purple/10 blur-[120px] -z-10 rounded-full" />
          <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden shadow-2xl flex h-[550px]">
            {/* Sidebar Mockup */}
            <div className="w-64 border-r border-white/5 bg-[#141414] p-6 flex flex-col gap-8 hidden md:flex">
              <div className="flex flex-col items-center gap-4">
                <img src="/logobranca.svg" alt="Logo" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                <div className="h-px w-full bg-white/5" />
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-white/30 tracking-widest uppercase">Menu Principal</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 text-accent-purple">
                    <LayoutGrid size={18} />
                    <span className="text-xs font-bold">Painel Geral</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg text-white/40">
                    <TrendingUp size={18} />
                    <span className="text-xs font-bold">Análises</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg text-white/40">
                    <Target size={18} />
                    <span className="text-xs font-bold">Minhas Metas</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto space-y-3">
                <div className="h-10 bg-white/5 border border-white/5 rounded-xl flex items-center px-3 text-[10px] text-white/20 font-medium">
                  Novo mês (Ex: Jul/25)
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <User size={14} className="text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 w-16 bg-white/20 rounded-full mb-1" />
                    <div className="h-1.5 w-24 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Mockup */}
            <div className="flex-1 bg-[#0d0d0d] p-8 overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Recebido', val: 'R$ 12.450,00', color: 'text-blue-400', icon: ArrowUpCircle },
                  { label: 'Total Pago', val: 'R$ 5.820,00', color: 'text-red-400', icon: ArrowDownCircle },
                  { label: 'Saldo Acumulado', val: 'R$ 6.630,00', color: 'text-accent-purple', icon: Wallet },
                  { label: 'Último Mês', val: 'R$ 1.200,00', color: 'text-white/40', icon: Calendar }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-1.5 rounded-lg bg-white/5">
                        <stat.icon size={16} className={stat.color} />
                      </div>
                    </div>
                    <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className={`text-sm font-black ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-xs font-bold">Evolução Financeira</div>
                    <div className="flex gap-3 text-[8px] font-bold">
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-purple" /> ENTRADAS</div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> SAÍDAS</div>
                    </div>
                  </div>
                  <div className="h-48 flex items-end gap-2 px-2">
                    {[30, 45, 35, 60, 40, 75, 50, 85, 65, 90, 70, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                        <div style={{ height: `${h}%` }} className={`w-full rounded-t-sm ${i % 2 === 0 ? 'bg-accent-purple/40' : 'bg-red-500/20'}`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                  <div className="text-xs font-bold mb-6">Meses Recentes</div>
                  <div className="space-y-3">
                    {['Maio/2024', 'Abril/2024', 'Março/2024'].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0d0d0d] border border-white/5">
                        <div className="text-[10px] font-bold">{m}</div>
                        <ChevronRight size={12} className="text-white/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                  <div className="text-[10px] font-black uppercase tracking-widest">Contas Pendentes</div>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { d: 'Aluguel / Financiamento', v: 'R$ 1.200,00', s: false },
                    { d: 'Energia Elétrica', v: 'R$ 245,50', s: true }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] opacity-60">
                      <div className={item.s ? 'line-through' : ''}>{item.d}</div>
                      <div className="font-bold">{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>



      {/* Features Grid */}
      <section id="recursos" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-block h-px w-12 bg-accent-purple mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Acelere seu controle usando<br />
              <span className="text-white/60 italic">processos inteligentes e simples.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm font-medium">
              Todas as ferramentas que você precisa para otimizar seus gastos, aumentar sua economia e crescer com confiança. Impulsionado por IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 ${index >= 3 ? 'md:col-span-1.5' : ''}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-accent-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 text-accent-lime text-[10px] font-black uppercase tracking-widest">
                    <div className="w-1 h-1 rounded-full bg-accent-lime" />
                    {feature.highlight}
                  </div>
                  {/* Visual effect for card */}
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={16} className="text-accent-purple/40" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 px-4 bg-white/[0.01] border-y border-white/5">
        <PricingSection 
          plans={pricingPlans}
          title="Preços Simples e Transparentes"
          description="Escolha o plano ideal para o seu crescimento financeiro."
        />
      </section>

      {/* CTA Section */}
      <section className="py-40 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-purple/20 blur-[150px] -z-10" />
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Pronto para transformar<br />suas finanças?
          </h2>
          <p className="text-white/50 text-lg font-medium">
            Use a NAVEX para automatizar seu controle e economizar como nunca.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onGetStarted}
              className="h-14 px-10 rounded-full bg-accent-lime text-black hover:bg-accent-lime/90 font-black shadow-[0_0_30px_rgba(218,235,68,0.2)]"
            >
              Começar Agora <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              className="h-14 px-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 font-bold"
            >
              Ver Todos os Recursos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center">
              <img src="/logobranca.svg" alt="NAVEX Finance" className="w-24 h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Tornando a gestão financeira mais simples, inteligente e acessível para todos através da IA.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-accent-purple">Produto</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Novidades</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-accent-purple">Empresa</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Serviço</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-accent-purple">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:border-accent-purple"
              />
              <button className="w-10 h-10 rounded-full bg-accent-purple flex items-center justify-center hover:bg-accent-purple/80 transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs font-medium">
          <p>© 2026 NAVEX Finance. Todos os direitos reservados-Code Less.</p>
        </div>
      </footer>
    </div>
  );
}
