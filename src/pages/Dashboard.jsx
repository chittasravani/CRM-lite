import { useCRM } from '../context/CRMContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { 
  Target, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { leads, customers, activities } = useCRM();
  const navigate = useNavigate();

  // 1. Compute KPI metrics
  const totalLeadsCount = leads.length;
  const totalCustomersCount = customers.length;
  
  // Pipeline value (all leads that are NOT Won or Lost)
  const activePipelineValue = leads
    .filter(l => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, lead) => sum + lead.value, 0);

  // Conversion rate: Won Leads / (Won + Lost)
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const lostLeads = leads.filter(l => l.status === 'Lost').length;
  const totalClosedDeals = wonLeads + lostLeads;
  const conversionRate = totalClosedDeals > 0 
    ? Math.round((wonLeads / totalClosedDeals) * 100) 
    : 0;

  // 2. Prepare chart data: Revenue by Date
  // Group leads by createdAt and sort
  const revenueByDateMap = leads.reduce((acc, lead) => {
    const date = lead.createdAt;
    acc[date] = (acc[date] || 0) + lead.value;
    return acc;
  }, {});

  const revenueChartData = Object.keys(revenueByDateMap)
    .sort()
    .map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Pipeline: revenueByDateMap[date]
    }));

  // If no data, provide fallback dummy trend for beautiful visual
  const finalRevenueChartData = revenueChartData.length > 0 ? revenueChartData : [
    { date: 'May 1', Pipeline: 4000 },
    { date: 'May 10', Pipeline: 12000 },
    { date: 'May 20', Pipeline: 8000 },
    { date: 'Jun 1', Pipeline: 18000 },
    { date: 'Jun 10', Pipeline: 25000 },
  ];

  // 3. Prepare chart data: Leads by Source
  const sourceCountMap = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const sourceChartData = Object.keys(sourceCountMap).map(source => ({
    name: source,
    Leads: sourceCountMap[source]
  }));

  const COLORS = ['#4f46e5', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Format activity timestamps
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Activity type icon/style helpers
  const getActivityIndicator = (type) => {
    switch (type) {
      case 'lead_created': return 'bg-blue-500 ring-blue-100';
      case 'lead_updated': return 'bg-amber-500 ring-amber-100';
      case 'lead_converted': return 'bg-emerald-500 ring-emerald-100';
      case 'lead_deleted': return 'bg-rose-500 ring-rose-100';
      case 'customer_created': return 'bg-indigo-500 ring-indigo-100';
      default: return 'bg-slate-400 ring-slate-100';
    }
  };

  const kpis = [
    {
      title: 'Active Pipeline',
      value: `$${activePipelineValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      change: '+12.5%',
      trend: 'up',
      desc: 'Sum of open opportunities'
    },
    {
      title: 'Total Leads',
      value: totalLeadsCount,
      icon: Target,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      change: '+8.2%',
      trend: 'up',
      desc: 'All prospects in database'
    },
    {
      title: 'Active Customers',
      value: totalCustomersCount,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      change: '+14.1%',
      trend: 'up',
      desc: 'Paying accounts'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      change: '-1.4%',
      trend: 'down',
      desc: 'Won vs Closed deals'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. KPIs Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div 
            key={kpi.title} 
            className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-800 tracking-tight">{kpi.value}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">{kpi.desc}</span>
              <span className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline Value Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Pipeline Revenue Stream</h3>
              <p className="text-xs text-slate-400">Chronological distribution of opportunity value</p>
            </div>
            <span className="rounded-xl bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
              Live Updates
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalRevenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(val) => `$${val >= 1000 ? (val / 1000) + 'k' : val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b', fontSize: '12px' }}
                  itemStyle={{ color: '#4f46e5', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Pipeline" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPipeline)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800">Leads by Channel</h3>
            <p className="text-xs text-slate-400">Marketing attribution split</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {sourceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="Leads" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {sourceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No source data available</div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Activities & Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity log */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recent Updates</h3>
              <p className="text-xs text-slate-400">Global system activity audit log</p>
            </div>
          </div>
          <div className="flow-root overflow-y-auto max-h-[300px] pr-2">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${getActivityIndicator(activity.type)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-xs font-medium text-slate-600">{activity.text}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-[10px] text-slate-400 font-semibold uppercase">
                          <time>{formatTime(activity.timestamp)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {activities.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400">
                  No activity logged yet.
                </div>
              )}
            </ul>
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Shortcuts & Tools</h3>
            <p className="text-xs text-slate-400 mb-6">Quick-access operations panel</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/leads')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700">Open Lead Pipeline</h4>
                    <p className="text-[10px] text-slate-400">Manage sales lanes & status</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-300" />
              </button>

              <button 
                onClick={() => navigate('/customers')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700">Customer Directory</h4>
                    <p className="text-[10px] text-slate-400">View active client roster & LTV</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-300" />
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-50 pt-4 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Startup CRM Lite v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
