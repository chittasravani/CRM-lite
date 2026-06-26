import React from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Clock,
  TrendingDown,
} from 'lucide-react';

export default React.memo(function StatsCards({
  totalLeads = 0,
  conversionRate = 0,
  pipelineValue = 0,
  wonRevenue = 0,
  avgSalesCycle = 0,
  lostRate = 0,
}) {
  const cards = [
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      subtext: 'Active database size',
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      accent: 'from-blue-500/5 to-transparent',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      subtext: 'Won / total leads',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      accent: 'from-emerald-500/5 to-transparent',
    },
    {
      title: 'Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      subtext: 'Active opportunities',
      icon: DollarSign,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      accent: 'from-indigo-500/5 to-transparent',
    },
    {
      title: 'Won Revenue',
      value: `$${wonRevenue.toLocaleString()}`,
      subtext: 'Converted deals value',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      accent: 'from-amber-500/5 to-transparent',
    },
    {
      title: 'Avg Sales Cycle',
      value: `${avgSalesCycle} Days`,
      subtext: 'Mean duration to win',
      icon: Clock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      accent: 'from-purple-500/5 to-transparent',
    },
    {
      title: 'Lost Rate',
      value: `${lostRate}%`,
      subtext: 'Closed lost deals',
      icon: TrendingDown,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      accent: 'from-rose-500/5 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`group relative flex flex-col justify-between overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-lg`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Subtle gradient glow on hover */}
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {card.title}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-white tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${card.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-500">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
