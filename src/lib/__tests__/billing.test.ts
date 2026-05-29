import { describe, it, expect } from 'vitest';
import { PRICING, getMonthlyCost, getYearlySavings, formatPrice } from '../pricingConfig';
import { hasFeature, canAddMonth } from '../plans';

describe('Preços', () => {
  it('basic é gratuito em ambos os ciclos', () => {
    expect(PRICING.basic.monthly).toBe(0);
    expect(PRICING.basic.yearly).toBe(0);
  });

  it('essential: R$19/mês e R$190/ano', () => {
    expect(PRICING.essential.monthly).toBe(19);
    expect(PRICING.essential.yearly).toBe(190);
  });

  it('pro: R$39/mês e R$390/ano', () => {
    expect(PRICING.pro.monthly).toBe(39);
    expect(PRICING.pro.yearly).toBe(390);
  });
});

describe('Economia anual', () => {
  it('essential: economiza R$38 por ano', () => {
    expect(getYearlySavings('essential')).toBe(38); // 19*12 - 190
  });

  it('pro: economiza R$78 por ano', () => {
    expect(getYearlySavings('pro')).toBe(78); // 39*12 - 390
  });

  it('basic: sem economia', () => {
    expect(getYearlySavings('basic')).toBe(0);
  });
});

describe('Custo mensal equivalente (anual)', () => {
  it('essential anual: ~R$15/mês', () => {
    expect(getMonthlyCost('essential', 'yearly')).toBe(15); // round(190/12)
  });

  it('pro anual: ~R$32/mês', () => {
    expect(getMonthlyCost('pro', 'yearly')).toBe(32); // round(390/12)
  });

  it('mensal não muda o valor', () => {
    expect(getMonthlyCost('essential', 'monthly')).toBe(19);
    expect(getMonthlyCost('pro', 'monthly')).toBe(39);
  });
});

describe('Formatação de preço', () => {
  it('basic retorna Grátis', () => {
    expect(formatPrice('basic', 'monthly')).toBe('Grátis');
    expect(formatPrice('basic', 'yearly')).toBe('Grátis');
  });

  it('essential mensal: R$19/mês', () => {
    expect(formatPrice('essential', 'monthly')).toBe('R$19/mês');
  });

  it('pro anual: R$390/ano', () => {
    expect(formatPrice('pro', 'yearly')).toBe('R$390/ano');
  });
});

describe('Upgrade: permissões mudam corretamente', () => {
  it('basic → essential: monthlyComparison liberado', () => {
    expect(hasFeature('basic', 'monthlyComparison')).toBe(false);
    expect(hasFeature('essential', 'monthlyComparison')).toBe(true);
  });

  it('essential → pro: financialGoals liberado', () => {
    expect(hasFeature('essential', 'financialGoals')).toBe(false);
    expect(hasFeature('pro', 'financialGoals')).toBe(true);
  });

  it('pro tem todas as features', () => {
    const proFeatures = ['categoriesCustom', 'monthlyComparison', 'advancedComparison',
      'categoryBudget', 'financialGoals', 'monthlyTemplates', 'annualView'] as const;
    proFeatures.forEach(f => expect(hasFeature('pro', f)).toBe(true));
  });
});

describe('Limite de meses por plano', () => {
  it('basic: bloqueado no 3º mês', () => {
    expect(canAddMonth('basic', 1)).toBe(true);
    expect(canAddMonth('basic', 2)).toBe(false);
  });

  it('essential/pro: ilimitado', () => {
    expect(canAddMonth('essential', 999)).toBe(true);
    expect(canAddMonth('pro', 999)).toBe(true);
  });
});

describe('Billing cycle toggle', () => {
  it('preço anual é sempre menor que 12x mensal (exceto basic)', () => {
    expect(PRICING.essential.yearly).toBeLessThan(PRICING.essential.monthly * 12);
    expect(PRICING.pro.yearly).toBeLessThan(PRICING.pro.monthly * 12);
  });
});
