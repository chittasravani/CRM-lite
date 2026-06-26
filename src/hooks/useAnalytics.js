import { useMemo, useCallback, useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from '../utils/analyticsHelpers';

/**
 * useAnalytics – Central hook for the Analytics module.
 * Consumes leads from CRMContext, applies date-range filtering,
 * and returns all computed KPIs + chart datasets via useMemo.
 * Optimized for 10,000+ leads with memoization throughout.
 */
export default function useAnalytics() {
  const { leads } = useCRM();
  const [dateRange, setDateRange] = useState('90d');

  // ---------- Date-range filtered leads ----------
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads) || leads.length === 0) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return leads.filter(lead => {
      if (!lead || !lead.createdAt) return false;
      const created = new Date(lead.createdAt);
      if (isNaN(created.getTime())) return false;

      const diffMs = startOfToday.getTime() - created.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      switch (dateRange) {
        case '7d':
          return diffDays <= 7 && diffDays >= 0;
        case '30d':
          return diffDays <= 30 && diffDays >= 0;
        case '90d':
          return diffDays <= 90 && diffDays >= 0;
        case 'year':
          return created.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [leads, dateRange]);

  // ---------- KPI cards ----------
  const kpis = useMemo(() => {
    const total = filteredLeads.length;
    const wonCount = filteredLeads.filter(l => l && l.status === 'Won').length;
    return {
      totalLeads: total,
      conversionRate: total > 0 ? Math.round((wonCount / total) * 100) : 0,
      pipelineValue: getPipelineValue(filteredLeads),
      wonRevenue: getWonRevenue(filteredLeads),
      avgSalesCycle: getAverageSalesCycle(filteredLeads),
      lostRate: getLostRate(filteredLeads),
    };
  }, [filteredLeads]);

  // ---------- Chart datasets ----------
  const statusData = useMemo(() => getStatusDistribution(filteredLeads), [filteredLeads]);
  const monthlyLeadsData = useMemo(() => getMonthlyLeads(filteredLeads), [filteredLeads]);
  const conversionTrendData = useMemo(() => getConversionByMonth(filteredLeads), [filteredLeads]);
  const revenueTrendData = useMemo(() => getRevenueByMonth(filteredLeads), [filteredLeads]);
  const sourceStatsData = useMemo(() => getLeadSourceStats(filteredLeads), [filteredLeads]);
  const funnelData = useMemo(() => getFunnelData(filteredLeads), [filteredLeads]);
  const salesVelocity = useMemo(() => getSalesVelocity(filteredLeads), [filteredLeads]);
  const forecastData = useMemo(() => getForecastRevenue(filteredLeads), [filteredLeads]);
  const topPerformers = useMemo(() => getTopPerformers(filteredLeads), [filteredLeads]);
  const heatmapData = useMemo(() => getActivityHeatmapData(filteredLeads), [filteredLeads]);

  // ---------- Actions ----------
  const handleRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  return {
    // Raw
    leads,
    filteredLeads,
    dateRange,
    handleRangeChange,

    // KPIs
    kpis,

    // Chart data
    statusData,
    monthlyLeadsData,
    conversionTrendData,
    revenueTrendData,
    sourceStatsData,
    funnelData,
    salesVelocity,
    forecastData,
    topPerformers,
    heatmapData,
  };
}
