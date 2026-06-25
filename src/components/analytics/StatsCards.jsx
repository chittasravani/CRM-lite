import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Clock, 
  TrendingDown 
} from 'lucide-react';

export default React.memo(function StatsCards({ 
  totalLeads = 0,
  conversionRate = 0,
  pipelineValue = 0,
  wonRevenue = 0,
  avgSalesCycle = 0,
  lostRate = 0
}) {
  const cards = [
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      subtext: 'Active database size',
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      subtext: 'Won / total leads',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      subtext: 'Active opportunities',
      icon: DollarSign,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Won Revenue',
      value: `$${wonRevenue.toLocaleString()}`,
      subtext: 'Converted deals value',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Avg Sales Cycle',
      value: `${avgSalesCycle} Days`,
      subtext: 'Mean duration to win',
      icon: Clock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Lost Rate',
      value: `${lostRate}%`,
      subtext: 'Closed lost deals',
      icon: TrendingDown,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className="flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700/80 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
                <h3 className="mt-2 text-xl font-extrabold text-slate-100 tracking-tight">{card.value}</h3>
              </div>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${card.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-450">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
