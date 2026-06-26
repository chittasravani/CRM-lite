import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-white">{label}</p>
        <p className="text-xs font-semibold mt-1.5 text-blue-400">
          Leads Created: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default React.memo(function BarChartCard({ data }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Monthly Lead Intake</h3>
        <p className="text-xs text-slate-400 mt-1">
          Leads captured during the last 6 months
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No monthly data to display</p>
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="blueIntakeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#334155"
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ fill: '#1e293b', opacity: 0.2 }}
                content={<CustomTooltip />}
              />

              <Bar
                dataKey="count"
                fill="url(#blueIntakeGrad)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
                isAnimationActive={true}
                animationDuration={900}
                animationBegin={100}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
