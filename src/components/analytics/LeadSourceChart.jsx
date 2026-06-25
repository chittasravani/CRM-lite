import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-slate-100">{data.name}</p>
        <p className="text-xs font-semibold mt-1 text-blue-400">
          Leads: <span className="font-bold">{data.count}</span>
        </p>
        <p className="text-[10px] text-slate-500 font-medium">
          Share: {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export default React.memo(function LeadSourceChart({ data }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100">Acquisition Channels</h3>
        <p className="text-xs text-slate-500">Leads by marketing attribution source</p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-550">
          <p className="text-xs">No lead source data to display</p>
        </div>
      ) : (
        <div className="h-56 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 15, bottom: 5 }}
            >
              <defs>
                <linearGradient id="blueSourceGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.95} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#334155"
                className="stroke-slate-800/80"
              />

              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                width={85}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.15 }} />

              <Bar
                dataKey="count"
                fill="url(#blueSourceGrad)"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationDuration={900}
                maxBarSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
