import React from 'react';
import { Sparkles, BarChart2 } from 'lucide-react';
import { getForecastRevenue } from '../../utils/analyticsHelpers';

export default React.memo(function ForecastCard({ leads = [] }) {
  const { forecast, confidence } = getForecastRevenue(leads);

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Revenue Forecast</h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">Predicted revenue for the upcoming month</p>

        {/* Big Forecast Value */}
        <div className="my-6">
          <span className="text-3xl font-extrabold text-blue-400 tracking-tight">
            ${forecast.toLocaleString()}
          </span>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Cohort Projection Model</p>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-450 font-medium">Confidence Level</span>
          <span className={`font-bold ${
            confidence >= 80 ? 'text-emerald-400' : 'text-amber-400'
          }`}>{confidence}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500" 
            style={{ width: `${confidence}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-500 leading-normal">
          Calculated using historical average cohort performance and current active pipeline conversion weighting.
        </p>
      </div>
    </div>
  );
});
