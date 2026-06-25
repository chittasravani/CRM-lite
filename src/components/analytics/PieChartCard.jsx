import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';

const STATUS_COLORS = {
  'New': '#94A3B8',
  'Contacted': '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  'Proposal Sent': '#7C3AED',
  'Won': '#22C55E',
  'Lost': '#EF4444'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
          <span 
            className="h-2 w-2 rounded-full inline-block" 
            style={{ backgroundColor: STATUS_COLORS[data.name] || '#94A3B8' }} 
          />
          {data.name}
        </p>
        <div className="mt-2 space-y-1 text-[11px]">
          <p className="text-slate-400">
            Leads: <span className="font-semibold text-slate-200">{data.value}</span>
          </p>
          <p className="text-blue-450 font-medium">
            Percentage: <span className="font-bold">{data.percentage}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default React.memo(function PieChartCard({ data }) {
  const hasData = Array.isArray(data) && data.some(item => item.value > 0);
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100">Lead Status Distribution</h3>
        <p className="text-xs text-slate-500">Pipeline stage distribution</p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No status data to display</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row flex-1 items-center justify-between gap-6">
          {/* Chart Section */}
          <div className="h-44 w-44 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={850}
                >
                  {data.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={STATUS_COLORS[entry.name] || '#94A3B8'} 
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Leads</span>
              <span className="text-lg font-extrabold text-slate-100 mt-0.5">
                {totalLeads}
              </span>
            </div>
          </div>

          {/* Legend Section */}
          <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-1 gap-2">
            {data.map((item) => (
              <div 
                key={item.name}
                className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span 
                    className="h-2 w-2 rounded-full shrink-0" 
                    style={{ backgroundColor: STATUS_COLORS[item.name] || '#94A3B8' }} 
                  />
                  <span className="text-[11px] font-medium text-slate-400 truncate">
                    {item.name}
                  </span>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-slate-200">
                    {item.value}
                  </span>
                  <span className="text-[9px] text-slate-500 ml-1.5 font-medium">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
