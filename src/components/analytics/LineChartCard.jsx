import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
        <p className="text-xs font-semibold mt-1.5 text-emerald-400">
          Conversion Rate:{' '}
          <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default React.memo(function LineChartCard({ data }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Conversion Trend</h3>
        <p className="text-xs text-slate-400 mt-1">
          Monthly won-leads conversion rate over last 6 months
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No conversion data to display</p>
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 18, right: 20, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="greenLineGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 5,
                  strokeWidth: 2,
                  fill: '#0f172a',
                  stroke: '#22c55e',
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 0,
                  fill: '#22c55e',
                  className: 'drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]',
                }}
                isAnimationActive={true}
                animationDuration={1100}
                animationBegin={200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
