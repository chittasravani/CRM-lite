import React, { useState, useMemo, useCallback } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  BarChart3, 
  Plus, 
  Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import analytics helper functions
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
  getFunnelData
} from '../utils/analyticsHelpers';

// Import upgraded components
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';

// Custom hook matching requirements
const useLeads = () => {
  const { leads } = useCRM();
  return { leads };
};

export default function Analytics() {
  const { leads = [] } = useLeads();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('90d'); // default 90 days to show all mock data beautifully

  // 1. Date Range Filter using useMemo (Highly optimized for 10,000+ leads)
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    
    // System reference date is June 25, 2026
    const refDate = new Date('2026-06-25T18:40:02+05:30');
    const startOfToday = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());

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
          return created.getFullYear() === refDate.getFullYear();
        default:
          return true;
      }
    });
  }, [leads, dateRange]);

  // 2. Metrics memoization to prevent redundant calculations on toggle
  const kpis = useMemo(() => {
    const total = filteredLeads.length;
    const wonCount = filteredLeads.filter(l => l && l.status === 'Won').length;
    
    const wonRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;
    const lostRate = getLostRate(filteredLeads);
    const pipeValue = getPipelineValue(filteredLeads);
    const wonRevenue = getWonRevenue(filteredLeads);
    const avgCycle = getAverageSalesCycle(filteredLeads);

    return {
      totalLeads: total,
      conversionRate: wonRate,
      pipelineValue: pipeValue,
      wonRevenue,
      avgSalesCycle: avgCycle,
      lostRate
    };
  }, [filteredLeads]);

  // 3. Chart Data memoizations
  const statusData = useMemo(() => getStatusDistribution(filteredLeads), [filteredLeads]);
  const monthlyLeadsData = useMemo(() => getMonthlyLeads(filteredLeads), [filteredLeads]);
  const conversionTrendData = useMemo(() => getConversionByMonth(filteredLeads), [filteredLeads]);
  const revenueTrendData = useMemo(() => getRevenueByMonth(filteredLeads), [filteredLeads]);
  const sourceStatsData = useMemo(() => getLeadSourceStats(filteredLeads), [filteredLeads]);
  const funnelData = useMemo(() => getFunnelData(filteredLeads), [filteredLeads]);

  // Handle filter selection
  const handleRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  // Global Empty State if CRM has absolutely zero leads
  if (!leads || leads.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4 bg-slate-950 text-slate-100">
        <div className="flex max-w-md flex-col items-center justify-center border border-dashed border-slate-800 rounded-3xl p-12 text-center bg-slate-900 shadow-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 shadow-inner">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No analytics available yet</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Add your first lead to start tracking performance metrics.
          </p>
          <button
            onClick={() => navigate('/leads')}
            className="mt-6 flex items-center gap-1.5 rounded-xl bg-blue-650 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Lead
          </button>
        </div>
      </div>
    );
  }

  // Filter Buttons Configuration
  const filterButtons = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'This Year', value: 'year' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 rounded-3xl border border-slate-900 shadow-2xl">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Track sales performance, conversion health, and growth trends.</p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800 self-start sm:self-auto shadow-inner">
          <span className="text-[10px] text-slate-500 px-2.5 font-bold uppercase tracking-wider hidden md:inline flex items-center gap-1">
            <Filter className="h-3 w-3" /> Range
          </span>
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleRangeChange(btn.value)}
              className={`rounded-lg px-4.5 py-2 text-xs font-bold transition-all ${
                dateRange === btn.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-450 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Section - 6 Columns layout */}
      <StatsCards {...kpis} />

      {/* 2-Column Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut status distribution chart */}
        <PieChartCard data={statusData} />

        {/* Monthly intake bar chart */}
        <BarChartCard data={monthlyLeadsData} />

        {/* Conversion growth trend */}
        <LineChartCard data={conversionTrendData} />

        {/* Revenue performance trend */}
        <RevenueChartCard data={revenueTrendData} />

        {/* Lead attribution source horizontal bar chart */}
        <LeadSourceChart data={sourceStatsData} />

        {/* Sequential conversion funnel */}
        <FunnelChartCard data={funnelData} />
      </div>

      {/* Bottom widgets grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Sales velocity card */}
        <SalesVelocityCard leads={filteredLeads} />

        {/* Forecasting card */}
        <ForecastCard leads={filteredLeads} />

        {/* Top sales performers leaderboard */}
        <TopPerformersCard leads={filteredLeads} />
      </div>

      {/* Full width GitHub-style heatmap at the bottom */}
      <ActivityHeatmap leads={filteredLeads} />
    </div>
  );
}
