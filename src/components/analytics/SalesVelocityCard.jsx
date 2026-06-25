import React from 'react';
import { Zap, HelpCircle } from 'lucide-react';

export default React.memo(function SalesVelocityCard({ leads = [] }) {
  // Opportunities: active leads
  const openOpps = leads.filter(l => l && l.status !== 'Won' && l.status !== 'Lost').length;
  
  // Win Rate: Won / Total
  const wonLeads = leads.filter(l => l && l.status === 'Won');
  const winRateNum = leads.length > 0 ? (wonLeads.length / leads.length) : 0;
  const winRatePct = Math.round(winRateNum * 100);
  
  // Avg Deal Size: won values / won count
  const wonRevenue = wonLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const avgDealSize = wonLeads.length > 0 ? Math.round(wonRevenue / wonLeads.length) : 0;
  
  // Sales cycle
  let totalDays = 0;
  let wonCount = 0;
  wonLeads.forEach(lead => {
    if (!lead || !lead.createdAt) return;
    const created = new Date(lead.createdAt);
    const won = lead.wonAt ? new Date(lead.wonAt) : new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
    if (!isNaN(created.getTime()) && !isNaN(won.getTime())) {
      totalDays += (won.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      wonCount++;
    }
  });
  const avgSalesCycle = wonCount > 0 ? Math.round(totalDays / wonCount) : 14;

  // Formula: (Open opportunities * Win Rate * Avg Deal Size) / Avg Sales Cycle Days
  const dailyVelocity = avgSalesCycle > 0 
    ? Math.round((openOpps * winRateNum * avgDealSize) / avgSalesCycle) 
    : 0;

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Sales Velocity</h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">Expected daily revenue production speed</p>

        {/* Big Velocity Value in Green */}
        <div className="my-6">
          <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            ${dailyVelocity.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold text-slate-500 ml-2">/ Day</span>
        </div>
      </div>

      {/* Formula Breakdown */}
      <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-450 flex items-center gap-1">Opportunities <HelpCircle className="h-3 w-3 text-slate-650" title="Active pipeline leads count" /></span>
          <span className="font-semibold text-slate-300">{openOpps} Leads</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-450 flex items-center gap-1">Win Rate <HelpCircle className="h-3 w-3 text-slate-650" title="Conversion rate of leads" /></span>
          <span className="font-semibold text-slate-300">{winRatePct}%</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-450 flex items-center gap-1">Avg Deal Size <HelpCircle className="h-3 w-3 text-slate-650" title="Average value of Won deals" /></span>
          <span className="font-semibold text-slate-300">${avgDealSize.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-450 flex items-center gap-1">Sales Cycle <HelpCircle className="h-3 w-3 text-slate-650" title="Mean days from creation to Win" /></span>
          <span className="font-semibold text-slate-300">{avgSalesCycle} Days</span>
        </div>
      </div>
    </div>
  );
});
