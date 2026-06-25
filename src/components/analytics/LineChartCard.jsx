import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-slate-100">{label}</p>
        <p className="text-xs font-semibold mt-1 text-emerald-450">
          Conversion Rate: <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default React.memo(function LineChartCard({ data }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100">Conversion Growth Trend</h3>
        <p className="text-xs text-slate-500">Won leads ratio of total closed opportunities monthly</p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No conversion data to display</p>
        </div>
      ) : (
        <div className="h-56 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 18, right: 20, left: -25, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#334155" 
                className="stroke-slate-800/80"
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
                dot={{ r: 4, strokeWidth: 2, fill: '#0f172a', stroke: '#22c55e' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
                isAnimationActive={true}
                animationDuration={1000}
              >
                <LabelList 
                  dataKey="rate" 
                  position="top" 
                  formatter={(v) => `${v}%`}
                  className="fill-slate-400 font-semibold text-[10px]"
                  offset={9}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
