import React, { useCallback } from 'react';
import { Filter } from 'lucide-react';

const FILTER_OPTIONS = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'This Year', value: 'year' },
];

export default React.memo(function AnalyticsFilters({ dateRange, onRangeChange }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/60 pb-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 max-w-md leading-relaxed">
          Track sales performance, pipeline health, revenue trends, and growth forecasting.
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800 self-start sm:self-auto shadow-inner">
        <span className="text-[10px] text-slate-500 px-2.5 font-bold uppercase tracking-wider hidden md:flex items-center gap-1.5">
          <Filter className="h-3 w-3" />
          Range
        </span>
        {FILTER_OPTIONS.map((btn) => (
          <button
            key={btn.value}
            onClick={() => onRangeChange(btn.value)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${
              dateRange === btn.value
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
});
