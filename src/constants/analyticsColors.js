/**
 * Analytics Color System
 * Centralized color palette for all analytics charts and components.
 * Matches the premium dark SaaS dashboard aesthetic.
 */

// Status colors for pipeline stages
export const STATUS_COLORS = {
  'New': '#94A3B8',
  'Contacted': '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  'Proposal Sent': '#7C3AED',
  'Won': '#22C55E',
  'Lost': '#EF4444',
};

// Funnel chart stage colors (ordered by funnel position)
export const FUNNEL_COLORS = [
  '#94A3B8', // New
  '#2563EB', // Contacted
  '#F59E0B', // Meeting Scheduled
  '#7C3AED', // Proposal Sent
  '#22C55E', // Won
];

// Source attribution colors
export const SOURCE_COLORS = {
  'Website': '#3B82F6',
  'Referral': '#22C55E',
  'LinkedIn': '#0A66C2',
  'Instagram': '#E1306C',
  'Ads': '#F59E0B',
  'Cold Email': '#8B5CF6',
};

// KPI card icon color configs
export const KPI_COLORS = {
  totalLeads: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  conversionRate: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  pipelineValue: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  wonRevenue: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  avgSalesCycle: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  lostRate: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

// Chart gradient IDs (used across multiple chart components)
export const GRADIENT_IDS = {
  blueBar: 'analyticsBlueBarGrad',
  greenRevenue: 'analyticsGreenRevenueGrad',
  blueSource: 'analyticsBlueSourceGrad',
};

// Heatmap intensity levels
export const HEATMAP_LEVELS = [
  { max: 0, bg: 'bg-slate-800/40', border: 'border-slate-800/30' },
  { max: 2, bg: 'bg-blue-950/70', border: 'border-blue-900/20' },
  { max: 4, bg: 'bg-blue-800/80', border: 'border-blue-800/20' },
  { max: 6, bg: 'bg-blue-600', border: 'border-blue-600/30' },
  { max: Infinity, bg: 'bg-blue-500', border: 'border-blue-500/30' },
];

// Tooltip/chart shared dark theme styles
export const CHART_THEME = {
  grid: { stroke: '#334155', strokeDasharray: '3 3' },
  axis: { fill: '#64748b', fontSize: 10, fontWeight: 600 },
  tooltip: {
    bg: 'bg-slate-950/95',
    border: 'border-slate-800',
    text: 'text-slate-100',
    sub: 'text-slate-400',
  },
};
