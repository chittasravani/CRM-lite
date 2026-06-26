import React from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default React.memo(function EmptyAnalyticsState() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="flex max-w-md flex-col items-center justify-center border border-dashed border-slate-800 rounded-3xl p-12 text-center bg-slate-900 shadow-lg">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 shadow-inner">
          <BarChart3 className="h-8 w-8" />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white">
          No analytics available yet
        </h3>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-xs">
          Add your first lead to start tracking business performance.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/leads')}
          className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>
    </div>
  );
});
