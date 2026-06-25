import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { getActivityHeatmapData } from '../../utils/analyticsHelpers';

// Helper to determine tailwind background color based on activity density
const getIntensityClass = (count) => {
  if (count === 0) return 'bg-slate-800/40 border border-slate-900/20';
  if (count <= 2) return 'bg-blue-950/70 border border-slate-900/10 text-blue-300';
  if (count <= 4) return 'bg-blue-800/80 border border-slate-900/10 text-blue-200';
  if (count <= 6) return 'bg-blue-650 border border-slate-900/10 text-blue-100';
  return 'bg-blue-500 shadow-sm shadow-blue-500/10 border border-slate-900/10 text-white';
};

export default React.memo(function ActivityHeatmap({ leads = [] }) {
  const heatmapData = useMemo(() => getActivityHeatmapData(leads), [leads]);

  // Construct a grid of weeks (columns) x days (rows)
  const calendarGrid = useMemo(() => {
    const weeksCount = 24; // ~5.5 months of data
    const now = new Date();
    
    // Find the starting date (Sunday of 24 weeks ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeksCount - 1) * 7);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Go to previous Sunday
    startDate.setHours(0, 0, 0, 0);

    const activityMap = {};
    heatmapData.forEach(item => {
      activityMap[item.date] = item.count;
    });

    const tempDate = new Date(startDate.getTime());
    const cols = [];

    for (let w = 0; w < weeksCount; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = tempDate.toISOString().split('T')[0];
        const count = activityMap[dateStr] || 0;
        
        weekDays.push({
          date: dateStr,
          count,
          dayLabel: tempDate.toLocaleString('default', { weekday: 'short' }),
          monthLabel: tempDate.toLocaleString('default', { month: 'short' }),
          formattedDate: tempDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }),
          dayOfMonth: tempDate.getDate()
        });
        
        tempDate.setDate(tempDate.getDate() + 1);
      }
      cols.push(weekDays);
    }
    return cols;
  }, [heatmapData]);

  // Extract month labels to place above specific columns
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = '';
    
    calendarGrid.forEach((week, wIndex) => {
      const firstDay = week[0];
      if (firstDay.monthLabel !== lastMonth) {
        labels.push({ text: firstDay.monthLabel, index: wIndex });
        lastMonth = firstDay.monthLabel;
      }
    });
    return labels;
  }, [calendarGrid]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 transition-all duration-200 hover:border-slate-700/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-blue-400" />
            Workspace Activity Heatmap
          </h3>
          <p className="text-xs text-slate-500 mt-1">Calendar tracking leads added, client meetings, and won conversions</p>
        </div>
        
        {/* Color Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded bg-slate-800/40 border border-slate-900/20" />
          <div className="h-2.5 w-2.5 rounded bg-blue-950/70" />
          <div className="h-2.5 w-2.5 rounded bg-blue-800/80" />
          <div className="h-2.5 w-2.5 rounded bg-blue-650" />
          <div className="h-2.5 w-2.5 rounded bg-blue-500" />
          <span>More</span>
        </div>
      </div>

      <div className="relative mt-6 overflow-x-auto select-none scrollbar-thin pb-2">
        <div className="min-w-[620px] flex flex-col pl-7">
          {/* Month Labels row */}
          <div className="h-5 relative text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {monthLabels.map((lbl, idx) => (
              <span 
                key={`${lbl.text}-${idx}`} 
                className="absolute"
                style={{ left: `${lbl.index * 24}px` }}
              >
                {lbl.text}
              </span>
            ))}
          </div>

          {/* Grid Area with Day Labels */}
          <div className="flex gap-[3.5px] relative">
            {/* Weekday labels down the left */}
            <div className="absolute -left-7 top-[2px] flex flex-col gap-[3.5px] text-[8px] font-extrabold text-slate-500 uppercase">
              <span className="h-[10px] flex items-center">Sun</span>
              <span className="h-[10px] flex items-center opacity-0">Mon</span>
              <span className="h-[10px] flex items-center">Tue</span>
              <span className="h-[10px] flex items-center opacity-0">Wed</span>
              <span className="h-[10px] flex items-center">Thu</span>
              <span className="h-[10px] flex items-center opacity-0">Fri</span>
              <span className="h-[10px] flex items-center">Sat</span>
            </div>

            {calendarGrid.map((week, wIndex) => (
              <div key={`week-${wIndex}`} className="flex flex-col gap-[3.5px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`group relative h-[10.5px] w-[10.5px] rounded-[2px] transition-all cursor-crosshair hover:scale-110 hover:ring-1 hover:ring-blue-400 ${getIntensityClass(day.count)}`}
                  >
                    {/* Floating mini tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded-lg bg-slate-950 border border-slate-800 p-2 shadow-xl group-hover:block whitespace-nowrap text-center animate-in fade-in zoom-in-95 duration-100">
                      <p className="text-[9px] font-bold text-slate-200">{day.formattedDate}</p>
                      <p className="text-[9px] text-blue-400 font-semibold mt-0.5">
                        {day.count} {day.count === 1 ? 'activity' : 'activities'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
