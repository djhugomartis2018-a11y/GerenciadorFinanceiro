import { TrendingUp, Target, BarChart3, ArrowRight, Sparkles, Smartphone, User } from 'lucide-react';
import { Button } from '../ui/button';
import { PricingSection } from '../ui/pricing';
import { ScrollShowcase } from './ScrollShowcase';
interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
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
            <img src="/logoverde.svg" alt="NAVEX Finance" className="w-20 h-20 relative z-10" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
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

      {/* Hero Section — clean, full viewport, sem mockup duplicado */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
              Você Registra. O Sistema Organiza.
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Organize suas<br />
            <span className="bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent italic">
              Finanças
            </span>{' '}
            com<br />
            <span className="text-white/30">Método e Clareza</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto font-medium leading-relaxed">
            Controle receitas, despesas e metas financeiras.<br />
            Sem automações invasivas. Só <span className="text-white/70 font-semibold">clareza real</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-2 h-13 px-8 py-4 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.12)]"
            >
              Começar grátis
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onGetStarted}
              className="h-13 px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] text-white text-sm font-bold hover:bg-white/[0.07] transition-all duration-300"
            >
              Ver demonstração
            </button>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {['Grátis para começar', 'Sem cartão de crédito', 'Cancele quando quiser'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-[11px] text-white/30 font-medium">
                <span className="text-accent-purple">✓</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs">
          <span>Role para ver o dashboard</span>
          <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/30 rounded-full animate-bounce" />
          </div>
        </div>
      </section>



      <ScrollShowcase />

      {/* Features Grid */}
      <section id="recursos" className="pt-16 pb-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-block h-px w-12 bg-accent-purple mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Acelere seu controle usando<br />
              <span className="text-white/60 italic">processos inteligentes e simples.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm font-medium">
              Todas as ferramentas que você precisa para acompanhar seus gastos, planejar com consistência e crescer com controle real.
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
      <section id="precos" className="relative py-32 px-4 bg-white/[0.01] border-y border-white/5">
        <PricingSection onSelectPlan={() => onGetStarted()} />
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Como Funciona</h2>
            <p className="text-white/40 max-w-xl mx-auto font-medium">Três passos simples para você assumir o controle total da sua vida financeira.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

            {[
              { step: '01', title: 'Criar Conta', desc: 'Cadastre-se em segundos com seu e-mail para começar sua jornada.', icon: User },
              { step: '02', title: 'Escolher Plano', desc: 'Selecione o plano que melhor se adapta às suas necessidades atuais.', icon: Target },
              { step: '03', title: 'Começar Organização', desc: 'Inicie seu controle financeiro com nossas ferramentas inteligentes.', icon: TrendingUp }
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-[#1a1a1a] border border-white/5 p-8 rounded-[2rem] hover:border-accent-purple/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={28} className="text-accent-purple" />
                </div>
                <div className="text-accent-purple text-xs font-black mb-2 tracking-widest uppercase">Passo {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-purple/20 blur-[150px] -z-10" />
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Pronto para transformar<br />suas finanças?
          </h2>
          <p className="text-white/50 text-lg font-medium">
            Use a NAVEX para organizar seu controle e acompanhar de perto cada mês.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onGetStarted}
              className="h-14 px-10 rounded-full bg-accent-lime text-black hover:bg-accent-lime/90 font-black shadow-[0_0_30px_rgba(218,235,68,0.2)]"
            >
              Começar Agora <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center">
              <img src="/logobranca.svg" alt="NAVEX Finance" className="w-24 h-24" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Tornando a gestão financeira mais simples, clara e acessível para quem gosta de método e organização.
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
