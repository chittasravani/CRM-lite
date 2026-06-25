import React from 'react';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  Tooltip,
  LabelList
} from 'recharts';

const FUNNEL_COLORS = [
  '#94A3B8', // New
  '#2563EB', // Contacted
  '#F59E0B', // Meeting Scheduled
  '#7C3AED', // Proposal Sent
  '#22C55E'  // Won
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-slate-100">{data.name}</p>
        <p className="text-xs font-semibold mt-1 text-indigo-400">
          Opportunities: <span className="font-bold">{data.value}</span>
        </p>
        <p className="text-[10px] text-slate-500 font-medium">
          Conversion Rate: {data.percentage}% of initial leads
        </p>
      </div>
    );
  }
  return null;
};

export default React.memo(function FunnelChartCard({ data }) {
  const hasData = Array.isArray(data) && data.length > 0 && data[0].value > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100">Sales Funnel</h3>
        <p className="text-xs text-slate-500">Cohort volume and drop-off conversion rates</p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-550">
          <p className="text-xs">No opportunities to show in funnel</p>
        </div>
      ) : (
        <div className="h-56 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive={true}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`funnel-cell-${index}`} 
                    fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} 
                    stroke="transparent"
                  />
                ))}
                
                <LabelList
                  position="right"
                  fill="#94a3b8"
                  stroke="none"
                  dataKey="name"
                  style={{ fontSize: 10, fontWeight: 600 }}
                  width={90}
                />
                
                <LabelList
                  position="inside"
                  fill="#ffffff"
                  stroke="none"
                  dataKey="percentage"
                  formatter={(val) => `${val}%`}
                  style={{ fontSize: 11, fontWeight: 700 }}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
