import { useState } from 'react';
import { ChevronRight, TrendingUp, Target, Wallet, BarChart3, Lock, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize toda sua situação financeira em um único lugar com gráficos interativos.',
      highlight: 'Dados em tempo real'
    },
    {
      icon: TrendingUp,
      title: 'Análise Detalhada',
      description: 'Acompanhe a evolução de suas finanças com histórico visual e relatórios.',
      highlight: 'Histórico visual'
    },
    {
      icon: Target,
      title: 'Metas Financeiras',
      description: 'Defina objetivos de poupança e acompanhe seu progresso com precisão.',
      highlight: 'Acompanhamento real'
    },
    {
      icon: Wallet,
      title: 'Gestão por Mês',
      description: 'Controle receitas e despesas de forma simples e organizada.',
      highlight: 'Organização total'
    },
    {
      icon: Lock,
      title: 'Segurança',
      description: 'Seus dados protegidos com autenticação segura e criptografia.',
      highlight: 'Proteção garantida'
    },
    {
      icon: Zap,
      title: 'Sincronização',
      description: 'Acesse seus dados de qualquer dispositivo, sempre sincronizado.',
      highlight: 'Acesso em qualquer lugar'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'Grátis',
      description: 'Perfeito para começar',
      features: [
        'Até 2 contas',
        '50 lançamentos/mês',
        'Visão mensal',
        'Suporte por email'
      ],
      cta: 'Começar',
      highlighted: false
    },
    {
      id: 'essential',
      name: 'Essencial',
      price: 'R$ 19',
      period: '/mês',
      description: 'Mais controle, mais liberdade',
      features: [
        'Lançamentos ilimitados',
        'Categorias personalizadas',
        'Relatórios simples',
        'Exportação de dados',
        'Suporte prioritário'
      ],
      cta: 'Assinar',
      highlighted: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 39',
      period: '/mês',
      description: 'Controle financeiro total',
      features: [
        'Metas financeiras avançadas',
        'Planejamento mensal',
        'Comparação de períodos',
        'Dashboard avançado',
        'Análise preditiva',
        'Suporte 24/7'
      ],
      cta: 'Assinar',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-lime/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-purple/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-lime/20 to-accent-purple/20 border border-accent-lime/30 backdrop-blur-sm">
            <Sparkles size={16} className="text-accent-lime" />
            <span className="text-sm font-semibold bg-gradient-to-r from-accent-lime to-accent-purple bg-clip-text text-transparent">
              Gestão Financeira Inteligente
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-accent-purple via-accent-lime to-accent-purple bg-clip-text text-transparent">
                Controle Seu Dinheiro
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-dim font-medium max-w-2xl mx-auto">
              Organize seus gastos, acompanhe suas metas e tome decisões financeiras mais inteligentes com a NAVEX Finance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-accent-purple to-accent-purple/80 text-white hover:from-accent-purple/90 hover:to-accent-purple/70 font-bold text-lg h-14 px-8 shadow-[0_0_30px_rgba(100,12,199,0.4)] hover:shadow-[0_0_50px_rgba(100,12,199,0.6)] transition-all duration-300 rounded-xl"
            >
              Começar Agora <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-accent-lime text-accent-lime hover:bg-accent-lime/10 font-bold text-lg h-14 px-8 rounded-xl transition-all duration-300"
            >
              Conhecer Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-lg text-text-dim max-w-2xl mx-auto">
              Recursos poderosos para gerenciar suas finanças pessoais de forma eficiente e intuitiva.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl border border-border bg-gradient-to-br from-background to-background/50 hover:border-accent-lime/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,235,68,0.1)]"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Icon Container */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-lime/20 to-accent-purple/20 flex items-center justify-center mb-4 group-hover:from-accent-lime/30 group-hover:to-accent-purple/30 transition-all duration-300">
                    <Icon size={28} className="text-accent-purple group-hover:text-accent-lime transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-text-dim mb-4">{feature.description}</p>

                  {/* Highlight Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-lime/10 border border-accent-lime/30">
                    <CheckCircle2 size={14} className="text-accent-lime" />
                    <span className="text-sm font-semibold text-accent-lime">{feature.highlight}</span>
                  </div>

                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent-purple to-accent-lime rounded-b-2xl w-0 group-hover:w-full transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-text-dim max-w-2xl mx-auto">
              Três passos simples para começar sua jornada financeira com a NAVEX.
            </p>
          </div>

          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-lime/30 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Crie sua Conta',
                description: 'Registre-se com seu e-mail e crie uma senha segura em segundos.',
                icon: '🚀'
              },
              {
                step: '02',
                title: 'Configure seus Dados',
                description: 'Adicione suas receitas, despesas e metas financeiras personalizadas.',
                icon: '⚙️'
              },
              {
                step: '03',
                title: 'Acompanhe e Evolua',
                description: 'Monitore seu progresso e tome decisões melhores com seus dados.',
                icon: '📈'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative text-center space-y-4 p-8 rounded-2xl border border-border bg-gradient-to-br from-background to-background/50 transition-all duration-500 hover:border-accent-lime/50 hover:shadow-[0_0_30px_rgba(218,235,68,0.1)] hover:-translate-y-2"
              >
                {/* Dot on line */}
                <div className="hidden md:flex absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-accent-lime to-accent-purple shadow-[0_0_20px_rgba(218,235,68,0.6)] border-4 border-background" />

                {/* Step Number */}
                <div className="text-6xl font-black bg-gradient-to-r from-accent-purple/30 to-accent-lime/30 bg-clip-text text-transparent group-hover:from-accent-purple/60 group-hover:to-accent-lime/60 transition-all duration-300">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="text-5xl">{item.icon}</div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-text-dim">{item.description}</p>
                </div>

                {/* Underline */}
                <div className="h-1 w-0 bg-gradient-to-r from-accent-purple to-accent-lime mx-auto group-hover:w-16 transition-all duration-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Planos e Preços
            </h2>
            <p className="text-lg text-text-dim max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades financeiras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'md:scale-105 border-2 border-accent-lime bg-gradient-to-br from-background via-accent-lime/5 to-background shadow-[0_0_40px_rgba(218,235,68,0.2)]'
                    : 'border border-border bg-gradient-to-br from-background to-background/50 hover:border-accent-lime/50 hover:shadow-[0_0_30px_rgba(218,235,68,0.1)]'
                }`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Badge for highlighted plan */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent-lime to-accent-purple text-background font-bold text-sm">
                    Mais Popular
                  </div>
                )}

                <div className="p-8 space-y-6">
                  {/* Plan Header */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-text-dim text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black bg-gradient-to-r from-accent-purple to-accent-lime bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-text-dim">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-accent-lime flex-shrink-0 mt-0.5" />
                        <span className="text-text-dim">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={onGetStarted}
                    className={`w-full h-12 font-bold text-lg rounded-xl transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-accent-purple to-accent-purple/80 text-white hover:from-accent-purple/90 hover:to-accent-purple/70 shadow-[0_0_30px_rgba(100,12,199,0.4)]'
                        : 'border-2 border-accent-lime text-accent-lime hover:bg-accent-lime/10'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>

                {/* Hover effect line */}
                {plan.highlighted && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-lime/0 via-accent-lime/5 to-accent-lime/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-xl text-text-dim">
              Comece gratuitamente e descubra como a NAVEX Finance pode ajudá-lo a alcançar seus objetivos financeiros.
            </p>
          </div>

          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-accent-lime to-accent-lime/80 text-background hover:from-accent-lime/90 hover:to-accent-lime/70 font-bold text-lg h-14 px-12 shadow-[0_0_30px_rgba(218,235,68,0.4)] hover:shadow-[0_0_50px_rgba(218,235,68,0.6)] transition-all duration-300 rounded-xl"
          >
            Comece Agora <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-text-dim text-sm">
          <p>© 2024 NAVEX Finance. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
