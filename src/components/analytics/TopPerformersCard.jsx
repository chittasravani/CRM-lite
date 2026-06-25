import React from 'react';
import { Award, User } from 'lucide-react';
import { getTopPerformers } from '../../utils/analyticsHelpers';

export default React.memo(function TopPerformersCard({ leads = [] }) {
  const performers = getTopPerformers(leads);
  const maxRevenue = performers.length > 0 ? performers[0].revenue : 1;

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Top Performers</h3>
            <p className="text-xs text-slate-500 mt-1">Sales owners ranked by Won deal value</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="h-4.5 w-4.5" />
          </div>
        </div>

        {performers.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-555">
            No performance records to display
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 mt-3">
            {performers.map((owner, index) => {
              const rank = index + 1;
              const ratio = Math.round((owner.revenue / maxRevenue) * 100);
              const initials = owner.name
                .split(' ')
                .map(n => n[0])
                .join('');

              return (
                <div key={owner.name} className="py-3 flex items-center justify-between gap-4">
                  {/* Rank / Profile */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-bold w-4 text-center shrink-0 ${
                      rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{rank}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-200 font-bold text-[11px] border border-slate-700/50">
                      {initials}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200 truncate">{owner.name}</p>
                      {/* Sub-bar showing ratio */}
                      <div className="w-24 mt-1.5 h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Revenue Value */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-100">${owner.revenue.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-500 font-medium">Won Revenue</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/80 pt-3 text-center">
        <p className="text-[10px] font-semibold text-slate-500 tracking-wider">
          Individual Attributions updated in real-time
        </p>
      </div>
    </div>
  );
});
