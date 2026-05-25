import { useState } from 'react';
import { ChevronRight, TrendingUp, Target, Wallet, BarChart3, Lock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize toda sua situação financeira em um único lugar com gráficos interativos e dados em tempo real.'
    },
    {
      icon: TrendingUp,
      title: 'Análise Detalhada',
      description: 'Acompanhe a evolução de suas finanças com histórico visual e tendências ao longo dos meses.'
    },
    {
      icon: Target,
      title: 'Metas Financeiras',
      description: 'Defina objetivos de poupança e acompanhe seu progresso rumo aos seus sonhos.'
    },
    {
      icon: Wallet,
      title: 'Gestão por Mês',
      description: 'Controle detalhado de receitas, despesas fixas e variáveis para cada período.'
    },
    {
      icon: Lock,
      title: 'Segurança em Primeiro Lugar',
      description: 'Seus dados são protegidos com autenticação segura e criptografia de ponta a ponta.'
    },
    {
      icon: Zap,
      title: 'Sincronização em Nuvem',
      description: 'Acesse seus dados de qualquer dispositivo com sincronização automática na nuvem.'
    }
  ];

  const stats = [
    { number: '100%', label: 'Responsivo' },
    { number: '24/7', label: 'Disponível' },
    { number: '∞', label: 'Meses' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-lime rounded-xl flex items-center justify-center shadow-lg shadow-accent-lime/20">
              <Wallet className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none">SALÁRIO PRO</h1>
              <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">Premium Finance</p>
            </div>
          </div>
          <Button
            onClick={onGetStarted}
            className="bg-accent-lime text-black hover:bg-[#00dd33] font-bold shadow-lg shadow-accent-lime/30 transition-all duration-300"
          >
            Entrar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-lime/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-tight">
                Controle Seu <span className="text-accent-lime">Dinheiro</span> com Precisão
              </h2>
              <p className="text-xl text-text-dim max-w-2xl mx-auto leading-relaxed">
                Gerencie suas finanças pessoais de forma inteligente. Dashboard completo, análises detalhadas e metas ao seu alcance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={onGetStarted}
                className="bg-[#00ff41] text-black hover:bg-[#00dd33] font-black text-lg h-14 px-8 shadow-[0_0_40px_rgba(0,255,65,0.5)] transition-all duration-300 group"
              >
                Começar Agora
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={24} />
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-surface-hover font-bold text-lg h-12"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Conhecer Mais
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-3xl font-black text-accent-lime">{stat.number}</p>
                  <p className="text-sm text-text-dim">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter">Funcionalidades Poderosas</h3>
            <p className="text-text-dim text-lg max-w-2xl mx-auto">
              Tudo que você precisa para dominar suas finanças em um único lugar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-border bg-background hover:border-accent-lime/50 hover:bg-surface/50 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(i)}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-lime/10 flex items-center justify-center mb-4 group-hover:bg-accent-lime/20 transition-colors">
                    <Icon className="text-accent-lime" size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                  <p className="text-text-dim text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter">Como Funciona</h3>
            <p className="text-text-dim text-lg">Três passos simples para começar sua jornada financeira</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Crie sua Conta',
                description: 'Registre-se com seu e-mail e crie uma senha segura em segundos.'
              },
              {
                step: '02',
                title: 'Configure seus Dados',
                description: 'Adicione suas receitas, despesas e metas financeiras personalizadas.'
              },
              {
                step: '03',
                title: 'Acompanhe e Evolua',
                description: 'Monitore seu progresso com análises detalhadas e tome decisões inteligentes.'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-center space-y-4">
                  <div className="text-5xl font-black text-accent-lime/30 mb-4">{item.step}</div>
                  <h4 className="text-xl font-bold">{item.title}</h4>
                  <p className="text-text-dim">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 text-accent-lime/30">
                    <ChevronRight size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
                  Por que escolher o Salário Pro?
                </h3>
                <p className="text-text-dim text-lg">
                  Desenvolvido com foco em usabilidade, segurança e performance para oferecer a melhor experiência.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Interface intuitiva e responsiva para todos os dispositivos',
                  'Dados sincronizados na nuvem com segurança de ponta a ponta',
                  'Gráficos interativos que facilitam a compreensão de suas finanças',
                  'Suporte a múltiplos meses de planejamento',
                  'Totalmente gratuito e sem taxas ocultas'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-lime/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-accent-lime" />
                    </div>
                    <p className="text-text-dim">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-lime/10 to-transparent rounded-2xl blur-3xl" />
              <div className="relative bg-surface/50 border border-border rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-text-dim uppercase tracking-widest font-bold">Seu Dashboard</p>
                  <h4 className="text-2xl font-black">Visão 360° das Suas Finanças</h4>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-accent-lime rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Receitas</span>
                    <span className="text-accent-lime font-bold">R$ 5.200,00</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-blue-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Despesas</span>
                    <span className="text-blue-500 font-bold">R$ 2.600,00</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-text-dim">Saldo</span>
                    <span className="text-2xl font-black text-accent-lime">R$ 2.600,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter">
              Pronto para Transformar suas Finanças?
            </h3>
            <p className="text-text-dim text-lg">
              Comece agora mesmo e tenha controle total sobre seu dinheiro. É rápido, fácil e seguro.
            </p>
          </div>

          <Button
            onClick={onGetStarted}
            className="bg-[#00ff41] text-black hover:bg-[#00dd33] font-black text-xl h-16 px-12 shadow-[0_0_50px_rgba(0,255,65,0.6)] transition-all duration-300 group inline-flex items-center gap-3"
          >
            Acessar Agora
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-lime rounded-lg flex items-center justify-center">
                <Wallet className="text-black w-5 h-5" />
              </div>
              <span className="font-bold">Salário Pro</span>
            </div>
            <p className="text-sm text-text-dim">
              © 2024 Salário Pro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
