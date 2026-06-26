import React from 'react';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  Tooltip,
  LabelList,
} from 'recharts';
import { FUNNEL_COLORS } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3.5 shadow-xl backdrop-blur-sm min-w-[180px]">
        <p className="text-xs font-bold text-white">{data.name}</p>
        <div className="mt-2 space-y-1.5 text-[11px]">
          <p className="text-slate-400">
            Opportunities:{' '}
            <span className="font-bold text-white">{data.value}</span>
          </p>
          <p className="text-blue-400 font-medium">
            Conversion: <span className="font-bold">{data.percentage}%</span> of initial
          </p>
          {data.dropOff > 0 && (
            <p className="text-rose-400 font-medium">
              Drop-off: <span className="font-bold">−{data.dropOff}</span>{' '}
              <span className="text-rose-400/70">({data.dropOffPct}%)</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default React.memo(function FunnelChartCard({ data }) {
  const hasData =
    Array.isArray(data) && data.length > 0 && data[0].value > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Sales Funnel</h3>
        <p className="text-xs text-slate-400 mt-1">
          Cohort volume, conversion rates, and stage drop-offs
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No opportunities to show in funnel</p>
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 10, right: 40, left: 10, bottom: 10 }}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive={true}
                animationDuration={900}
                animationBegin={200}
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
