import React, { useState, useCallback } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector,
} from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-bold text-white flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full inline-block"
            style={{ backgroundColor: STATUS_COLORS[data.name] || '#94A3B8' }}
          />
          {data.name}
        </p>
        <div className="mt-2 space-y-1 text-[11px]">
          <p className="text-slate-400">
            Leads: <span className="font-semibold text-white">{data.value}</span>
          </p>
          <p className="text-blue-400 font-medium">
            Share: <span className="font-bold">{data.percentage}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/** Renders the expanded "active" sector on hover */
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
  } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
      />
    </g>
  );
};

export default React.memo(function PieChartCard({ data }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const hasData = Array.isArray(data) && data.some((item) => item.value > 0);
  const totalLeads = hasData ? data.reduce((sum, item) => sum + item.value, 0) : 0;

  const onPieEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onPieLeave = useCallback(() => setActiveIndex(-1), []);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Lead Status Distribution</h3>
        <p className="text-xs text-slate-400 mt-1">Pipeline stage distribution</p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-slate-500">
          <p className="text-xs">No status data to display</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row flex-1 items-center justify-between gap-6">
          {/* Doughnut */}
          <div className="h-48 w-48 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={900}
                  animationBegin={100}
                  activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={STATUS_COLORS[entry.name] || '#94A3B8'}
                      stroke="transparent"
                      className="transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Leads
              </span>
              <span className="text-xl font-extrabold text-white mt-0.5">
                {totalLeads}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-1 gap-2">
            {data.map((item, idx) => (
              <div
                key={item.name}
                className={`flex items-center justify-between gap-2 p-1.5 rounded-xl transition-colors cursor-default ${
                  activeIndex === idx
                    ? 'bg-slate-800/60'
                    : 'hover:bg-slate-800/40'
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[item.name] || '#94A3B8' }}
                  />
                  <span className="text-[11px] font-medium text-slate-400 truncate">
                    {item.name}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-white">
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
