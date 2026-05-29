import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const plans = [
    {
      name: "Básico",
      price: "R$ 0",
      annualPrice: "R$ 0",
      period: "por usuário/mês",
      description: "Para começar sem custos",
      features: [
        "Até 2 contas",
        "50 lançamentos/mês",
        "Visão mensal",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      highlighted: false,
    },
    {
      name: "Essencial",
      price: "R$ 19",
      annualPrice: "R$ 15",
      period: "por usuário/mês",
      description: "Mais controle, mais liberdade",
      features: [
        "Lançamentos ilimitados",
        "Categorias personalizadas",
        "Relatórios simples",
        "Exportação de dados",
        "Suporte prioritário",
      ],
      cta: "Assinar Agora",
      highlighted: true,
    },
    {
      name: "Pro",
      price: "R$ 39",
      annualPrice: "R$ 31",
      period: "por usuário/mês",
      description: "Controle financeiro total",
      features: [
        "Metas financeiras avançadas",
        "Planejamento mensal",
        "Comparação de períodos",
        "Dashboard avançado",
        "Análise preditiva",
        "Suporte 24/7",
      ],
      cta: "Começar com Pro",
      highlighted: false,
    },
  ];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const setSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect?.width ?? window.innerWidth));
      canvas.height = Math.max(1, Math.floor(rect?.height ?? window.innerHeight));
    };
    setSize();
    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;
    const make = (): P => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, v: Math.random() * 0.25 + 0.05, o: Math.random() * 0.25 + 0.05 });
    const init = () => { ps = []; const c = Math.floor((canvas.width * canvas.height) / 14000); for (let i = 0; i < c; i++) ps.push(make()); };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach(p => {
        p.y -= p.v;
        if (p.y < 0) { p.x = Math.random() * canvas.width; p.y = canvas.height + 20; }
        ctx.fillStyle = `rgba(240,240,242,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(() => { setSize(); init(); });
    ro.observe(canvas.parentElement || document.body);
    init(); raf = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={`pv3-wrap ${ready ? "pv3-ready" : ""}`}>
      <style>{`
        .pv3-wrap { position: relative; width: 100%; overflow: hidden; }
        .pv3-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.4; pointer-events: none; }

        /* Toggle */
        .pv3-toggle { display: inline-flex; align-items: center; background: rgba(255,255,255,0.06); border-radius: 9999px; padding: 4px; gap: 2px; }
        .pv3-tbtn { padding: 9px 24px; border-radius: 9999px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: background .2s, color .2s; }
        .pv3-tbtn.active { background: rgba(255,255,255,0.12); color: #fff; }
        .pv3-tbtn.inactive { background: transparent; color: rgba(255,255,255,0.45); }

        /* Cards grid */
        .pv3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1080px; margin: 0 auto; align-items: start; }
        @media (max-width: 860px) { .pv3-grid { grid-template-columns: 1fr; max-width: 420px; } }

        /* Card base */
        .pv3-card { background: #111214; border: 1px solid #2a2a2e; border-radius: 16px; padding: 28px; display: flex; flex-direction: column; position: relative; transition: border-color .2s; }
        .pv3-card:hover { border-color: rgba(255,255,255,0.15); }

        /* Card popular */
        .pv3-card-pop { background: #15161a; border: 1px solid #2a2a2e; border-radius: 16px; padding: 28px; display: flex; flex-direction: column; position: relative; transform: scale(1.02); box-shadow: 0 8px 32px rgba(0,0,0,.45); }

        /* Most popular badge */
        .pv3-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: rgba(20,20,24,0.9); border: 1px solid #3a3a3e; border-radius: 9999px; padding: 4px 14px; font-size: 12px; font-weight: 600; color: #e6e7ea; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
        .pv3-badge-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.7); animation: pv3pulse 1.5s infinite; }
        @keyframes pv3pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Card content */
        .pv3-name { font-size: 18px; font-weight: 600; color: #fff; margin: 0 0 4px; }
        .pv3-desc { font-size: 13px; color: #a6a7ac; margin: 0 0 18px; }
        .pv3-price-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; }
        .pv3-price { font-size: 42px; font-weight: 800; color: #fff; line-height: 1; }
        .pv3-period { font-size: 13px; color: #a6a7ac; font-weight: 400; }
        .pv3-billing { font-size: 12px; color: rgba(255,255,255,0.3); margin: 0 0 22px; }
        .pv3-sep { height: 1px; background: #2a2a2e; margin-bottom: 20px; }
        .pv3-features { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .pv3-feature { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #d4d5d9; }
        .pv3-check { color: #666; flex-shrink: 0; }

        /* Buttons */
        .pv3-btn-primary { width: 100%; padding: 13px; border-radius: 10px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; background: #f1f1f3; color: #0c0c0d; transition: filter .15s, transform .15s; }
        .pv3-btn-primary:hover { filter: brightness(.94); }
        .pv3-btn-primary:active { transform: translateY(1px); }
        .pv3-btn-ghost { width: 100%; padding: 13px; border-radius: 10px; font-size: 14px; font-weight: 700; border: 1px solid #2a2a2e; cursor: pointer; background: transparent; color: #fff; transition: background .2s, border-color .2s, transform .15s; }
        .pv3-btn-ghost:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.2); }
        .pv3-btn-ghost:active { transform: translateY(1px); }

        /* Fade in */
        .pv3-card-in { opacity: 0; transform: translateY(14px); }
        .pv3-ready .pv3-card-in { animation: pv3up .55s ease forwards; }
        @keyframes pv3up { to { opacity:1; transform:translateY(0); } }
      `}</style>

      <canvas ref={canvasRef} className="pv3-canvas" />

      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 12px' }}>
            Preços Simples e Transparentes
          </h2>
          <p style={{ fontSize: 16, color: '#a6a7ac', margin: '0 0 28px' }}>
            Escolha o plano ideal para o seu crescimento financeiro.
          </p>

          <div className="pv3-toggle">
            <button className={`pv3-tbtn ${!isAnnual ? 'active' : 'inactive'}`} onClick={() => setIsAnnual(false)}>Mensal</button>
            <button className={`pv3-tbtn ${isAnnual ? 'active' : 'inactive'}`} onClick={() => setIsAnnual(true)}>Anual</button>
          </div>
        </div>

        {/* Cards */}
        <div className="pv3-grid">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`pv3-card-in ${plan.highlighted ? 'pv3-card-pop' : 'pv3-card'}`}
              style={{ animationDelay: `${0.08 + i * 0.1}s` }}
            >
              {plan.highlighted && (
                <div className="pv3-badge">
                  <span className="pv3-badge-dot" />
                  Mais Popular
                </div>
              )}

              <p className="pv3-name">{plan.name}</p>
              <div className="pv3-price-row">
                <span className="pv3-price">{isAnnual ? plan.annualPrice : plan.price}</span>
                <span className="pv3-period">{plan.period}</span>
              </div>
              <p className="pv3-billing">{isAnnual ? 'Cobrado anualmente' : 'Cobrado mensalmente'}</p>
              <p className="pv3-desc">{plan.description}</p>

              <div className="pv3-sep" />

              <ul className="pv3-features">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="pv3-feature">
                    <Check size={15} className="pv3-check" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className={plan.highlighted ? 'pv3-btn-primary' : 'pv3-btn-ghost'}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
