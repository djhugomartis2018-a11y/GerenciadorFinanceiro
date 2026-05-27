import { useState } from 'react';
import { ChevronRight, TrendingUp, Target, Wallet, BarChart3, Lock, Zap, ArrowRight, Sparkles, CheckCircle2, PlayCircle, Globe, Layout, ShieldCheck, BarChart, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';
import { PricingSection } from '../ui/pricing';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Layout,
      title: 'Soluções com IA',
      description: 'Gestão de tarefas impulsionada por IA para fluxos de trabalho simplificados e eficazes.',
      highlight: 'IA Integrada'
    },
    {
      icon: Globe,
      title: 'Suporte Personalizado',
      description: 'Muitas tarefas agora são automatizadas, permitindo que nossos usuários trabalhem de forma mais eficaz.',
      highlight: 'Suporte 24/7'
    },
    {
      icon: BarChart,
      title: 'Integração de Dados',
      description: 'Conecte facilmente seus cartões de crédito, empréstimos, investimentos e contas bancárias.',
      highlight: 'Conexão Total'
    },
    {
      icon: PlayCircle,
      title: 'Automação Inteligente',
      description: 'Aproveitando a IA para criar fluxos de trabalho que simplificam tarefas e aumentam a produtividade.',
      highlight: 'Automação'
    },
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
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Início</a>
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
            <a href="#" className="hover:text-white transition-colors">Recursos</a>
            <a href="#" className="hover:text-white transition-colors">Preços</a>
            <a href="#" className="hover:text-white transition-colors">Integrações</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-purple text-xs font-bold hover:bg-accent-purple/80 transition-all"
          >
            Contato <ArrowRight size={14} />
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
          <div className="relative mt-20 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-accent-purple/20 blur-[100px] -z-10 rounded-full" />
            <div className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-bold">Q</span>
                  </div>
                  <div className="h-8 w-40 bg-white/5 rounded-md" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="h-4 w-20 bg-white/10 rounded-full" />
                </div>
              </div>
              {/* Fake UI Body */}
              <div className="p-8 grid grid-cols-12 gap-6 h-[400px]">
                <div className="col-span-8 space-y-6">
                  <div className="h-8 w-48 bg-white/10 rounded-lg" />
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-8 rounded-full bg-accent-purple" />
                    <div className="h-8 rounded-full bg-white/5" />
                    <div className="h-8 rounded-full bg-white/5" />
                    <div className="h-8 rounded-full bg-white/5" />
                  </div>
                  <div className="h-full bg-white/[0.02] rounded-2xl border border-white/5 p-6">
                    <div className="flex justify-between items-end h-full gap-4">
                      {[40, 60, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group">
                          <div 
                            style={{ height: `${h}%` }} 
                            className={`w-full rounded-t-lg transition-all ${i === 3 ? 'bg-accent-purple shadow-[0_0_20px_rgba(100,12,199,0.5)]' : 'bg-white/10'}`} 
                          />
                          {i === 3 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white rounded text-[10px] text-black font-bold">
                              +$32.45
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-4 space-y-6">
                  <div className="h-48 bg-accent-purple/10 rounded-2xl border border-accent-purple/20 p-6 flex flex-col justify-between">
                    <div className="h-4 w-24 bg-white/20 rounded-full" />
                    <div className="text-3xl font-bold">$456,000</div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-accent-lime" />
                    </div>
                  </div>
                  <div className="h-32 bg-white/[0.02] rounded-2xl border border-white/5 p-6">
                    <div className="h-4 w-24 bg-white/10 rounded-full mb-4" />
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-white/5 rounded-full" />
                      <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-12">Confiado por mais de 10.000 usuários</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale">
            <span className="text-xl font-black">LOGOIPSUM</span>
            <span className="text-xl font-black italic">IPSUM</span>
            <span className="text-xl font-black">logo</span>
            <span className="text-xl font-black underline decoration-accent-purple decoration-4">LOOO</span>
            <span className="text-xl font-black">Logoip</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 relative">
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

          <div className="grid md:grid-cols-3 gap-6">
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
            Junte-se a milhares de pessoas que já usam a NAVEX para automatizar seu controle e economizar como nunca.
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
