import React, { useState, useEffect } from 'react';
import useAnalytics from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

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

export default function Analytics() {
  const {
    leads,
    filteredLeads,
    dateRange,
    handleRangeChange,
    kpis,
    statusData,
    monthlyLeadsData,
    conversionTrendData,
    revenueTrendData,
    sourceStatsData,
    funnelData,
  } = useAnalytics();

  const [isLoading, setIsLoading] = useState(true);

  // Simulate a short delay to display the premium loading skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Render empty state if there are absolutely zero leads
  if (!leads || leads.length === 0) {
    return <EmptyAnalyticsState />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 rounded-3xl border border-slate-900 shadow-2xl">
      {/* Header & Date Range Filter Section */}
      <AnalyticsFilters dateRange={dateRange} onRangeChange={handleRangeChange} />

      {/* KPI Cards Row */}
      <StatsCards {...kpis} />

      {/* Modern SaaS grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart & Monthly Leads */}
        <PieChartCard data={statusData} />
        <BarChartCard data={monthlyLeadsData} />

        {/* Full Width Conversion Trend */}
        <div className="lg:col-span-2">
          <LineChartCard data={conversionTrendData} />
        </div>

        {/* Revenue Trend & Lead Sources */}
        <RevenueChartCard data={revenueTrendData} />
        <LeadSourceChart data={sourceStatsData} />

        {/* Sales Velocity & Revenue Forecast */}
        <SalesVelocityCard leads={filteredLeads} />
        <ForecastCard leads={filteredLeads} />

        {/* Sales Funnel & Top Performers */}
        <FunnelChartCard data={funnelData} />
        <TopPerformersCard leads={filteredLeads} />

        {/* Full Width Activity Heatmap */}
        <div className="lg:col-span-2">
          <ActivityHeatmap leads={filteredLeads} />
        </div>
      </div>
    </div>
  );
}
