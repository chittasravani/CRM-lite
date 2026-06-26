import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { SOURCE_COLORS } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-white">{data.name}</p>
        <p className="text-xs font-semibold mt-1.5 text-blue-400">
          Leads: <span className="font-bold">{data.count}</span>
        </p>
        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
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
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Lead Sources</h3>
        <p className="text-xs text-slate-400 mt-1">
          Leads by marketing attribution channel
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No lead source data to display</p>
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 15, bottom: 5 }}
            >
              <defs>
                <linearGradient id="sourceBarGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.95} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#334155"
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

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: '#1e293b', opacity: 0.15 }}
              />

              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                isAnimationActive={true}
                animationDuration={900}
                animationBegin={150}
                maxBarSize={18}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SOURCE_COLORS[entry.name] || '#3B82F6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
