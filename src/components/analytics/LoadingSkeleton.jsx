import React from 'react';

/** Skeleton pulse block for reuse */
const Pulse = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-800/60 ${className}`} />
);

/** Single KPI card skeleton */
const CardSkeleton = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-2.5 flex-1">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-6 w-28" />
      </div>
      <Pulse className="h-9 w-9 rounded-xl shrink-0" />
    </div>
    <Pulse className="h-3 w-24 mt-4" />
  </div>
);

/** Chart card skeleton (half-width) */
const ChartSkeleton = ({ height = 'h-64' }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="space-y-2 mb-4">
      <Pulse className="h-4 w-36" />
      <Pulse className="h-3 w-56" />
    </div>
    <Pulse className={`w-full ${height}`} />
  </div>
);

/** Full-width chart skeleton */
const FullWidthChartSkeleton = ({ height = 'h-64' }) => (
  <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="space-y-2 mb-4">
      <Pulse className="h-4 w-48" />
      <Pulse className="h-3 w-72" />
    </div>
    <Pulse className={`w-full ${height}`} />
  </div>
);

/** Widget skeleton (for velocity/forecast/performers) */
const WidgetSkeleton = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
    <div className="flex justify-between">
      <div className="space-y-2">
        <Pulse className="h-4 w-28" />
        <Pulse className="h-3 w-40" />
      </div>
      <Pulse className="h-8 w-8 rounded-lg" />
    </div>
    <Pulse className="h-8 w-32" />
    <div className="border-t border-slate-800 pt-4 space-y-3">
      <Pulse className="h-3 w-full" />
      <Pulse className="h-3 w-4/5" />
      <Pulse className="h-3 w-3/4" />
    </div>
  </div>
);

/**
 * LoadingSkeleton
 * Full-page skeleton that mirrors the analytics dashboard layout
 * while data is being computed or the component is loading.
 */
export default React.memo(function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 rounded-3xl border border-slate-900">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/60 pb-6">
        <div className="space-y-2.5">
          <Pulse className="h-7 w-52" />
          <Pulse className="h-4 w-80" />
        </div>
        <Pulse className="h-10 w-72 rounded-xl" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={`kpi-${i}`} />
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 1: Pie + Bar */}
        <ChartSkeleton height="h-52" />
        <ChartSkeleton height="h-52" />

        {/* Row 2: Full width conversion trend */}
        <FullWidthChartSkeleton height="h-56" />

        {/* Row 3: Revenue + Sources */}
        <ChartSkeleton height="h-52" />
        <ChartSkeleton height="h-52" />

        {/* Row 4: Velocity + Forecast */}
        <WidgetSkeleton />
        <WidgetSkeleton />

        {/* Row 5: Funnel + Performers */}
        <ChartSkeleton height="h-52" />
        <WidgetSkeleton />

        {/* Row 6: Full width heatmap */}
        <FullWidthChartSkeleton height="h-32" />
      </div>
    </div>
  );
});
