export type Plan = 'basic' | 'essential' | 'pro';

export interface PlanConfig {
  maxMonths: number;
  // ── Essencial ──────────────────────────────────────────
  parcelamentos: boolean;       // Controle de parcelamentos
  categoriesCustom: boolean;
  monthlyComparison: boolean;
  financialScore: boolean;      // Score financeiro pessoal (0–1000)
  exportPdf: boolean;           // Exportar relatório em PDF
  spendingTrends: boolean;      // Gráfico de tendências mensais
  // ── Pro ────────────────────────────────────────────────
  advancedComparison: boolean;
  categoryBudget: boolean;
  financialGoals: boolean;
  monthlyTemplates: boolean;
  annualView: boolean;
  budgetAlerts: boolean;        // Alertas ao atingir % do orçamento
  aiInsights: boolean;          // Insights gerados por IA
  spendingPrediction: boolean;  // Previsão de gastos do próximo mês
  exportExcel: boolean;         // Exportar Excel / CSV
  gamification: boolean;        // Conquistas e streaks
  yearInReview: boolean;        // Ano em revisão visual
}

export type GatedFeature = keyof Omit<PlanConfig, 'maxMonths'>;

export const PLANS: Record<Plan, PlanConfig> = {
  basic: {
    maxMonths: 2,
    parcelamentos: false,
    categoriesCustom: false,
    monthlyComparison: false,
    financialScore: false,
    exportPdf: false,
    spendingTrends: false,
    advancedComparison: false,
    categoryBudget: false,
    financialGoals: false,
    monthlyTemplates: false,
    annualView: false,
    budgetAlerts: false,
    aiInsights: false,
    spendingPrediction: false,
    exportExcel: false,
    gamification: false,
    yearInReview: false,
  },
  essential: {
    maxMonths: Infinity,
    parcelamentos: true,
    categoriesCustom: true,
    monthlyComparison: true,
    financialScore: true,
    exportPdf: true,
    spendingTrends: true,
    advancedComparison: false,
    categoryBudget: false,
    financialGoals: false,
    monthlyTemplates: false,
    annualView: false,
    budgetAlerts: false,
    aiInsights: false,
    spendingPrediction: false,
    exportExcel: false,
    gamification: false,
    yearInReview: false,
  },
  pro: {
    maxMonths: Infinity,
    parcelamentos: true,
    categoriesCustom: true,
    monthlyComparison: true,
    financialScore: true,
    exportPdf: true,
    spendingTrends: true,
    advancedComparison: true,
    categoryBudget: true,
    financialGoals: true,
    monthlyTemplates: true,
    annualView: true,
    budgetAlerts: true,
    aiInsights: true,
    spendingPrediction: true,
    exportExcel: true,
    gamification: true,
    yearInReview: true,
  },
};

export const PLAN_NAMES: Record<Plan, string> = {
  basic: 'Básico',
  essential: 'Essencial',
  pro: 'Pro',
};

export const FEATURE_REQUIRES: Record<GatedFeature, Plan> = {
  // Essencial+
  parcelamentos: 'essential',
  categoriesCustom: 'essential',
  monthlyComparison: 'essential',
  financialScore: 'essential',
  exportPdf: 'essential',
  spendingTrends: 'essential',
  // Pro+
  advancedComparison: 'pro',
  categoryBudget: 'pro',
  financialGoals: 'pro',
  monthlyTemplates: 'pro',
  annualView: 'pro',
  budgetAlerts: 'pro',
  aiInsights: 'pro',
  spendingPrediction: 'pro',
  exportExcel: 'pro',
  gamification: 'pro',
  yearInReview: 'pro',
};

// Highlights shown inside the UpgradeGate for each plan
export const PLAN_HIGHLIGHTS: Record<Exclude<Plan, 'basic'>, string[]> = {
  essential: [
    'Meses ilimitados',
    'Score Financeiro pessoal',
    'Comparação entre meses',
    'Categorias personalizadas',
    'Exportação em PDF',
    'Tendências de gastos',
  ],
  pro: [
    'Insights com Inteligência Artificial',
    'Previsão de gastos do próximo mês',
    'Alertas de orçamento por categoria',
    'Metas financeiras avançadas',
    'Exportação Excel / CSV',
    'Visão anual consolidada',
    'Gamificação e conquistas',
  ],
};

export function hasFeature(plan: Plan, feature: GatedFeature): boolean {
  return PLANS[plan][feature];
}

export function canAddMonth(plan: Plan, currentCount: number): boolean {
  return currentCount < PLANS[plan].maxMonths;
}
