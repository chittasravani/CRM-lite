/**
 * Upgraded CRM Analytics Helper Utilities
 * High-performance, pure functions optimized for 10,000+ leads.
 * Handles missing fields and schema changes defensively.
 */

// ─── Internal Helpers ────────────────────────────────────────────

/** Safe date parser – returns Date or null */
const parseDate = (dateVal) => {
  if (!dateVal) return null;
  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/** Distribute owners deterministically if missing */
const getLeadOwner = (lead) => {
  if (lead.owner) return lead.owner;
  const owners = ['Alex Rivera', 'Jessica Vance', 'Michael K.'];
  const hash = lead.id
    ? lead.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  return owners[hash % owners.length];
};

/** Normalise status strings to canonical stage names */
const mapLeadStatus = (status) => {
  if (!status) return 'New';
  const trimmed = status.trim();
  if (trimmed === 'Qualified') return 'Meeting Scheduled';
  if (trimmed === 'Proposal') return 'Proposal Sent';
  return trimmed;
};

/** Build array of last‑6‑months metadata */
const generateLast6MonthsKeys = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ name: monthName, monthKey, count: 0, won: 0, total: 0, revenue: 0 });
  }
  return months;
};

// ─── Exported Analytics Functions ────────────────────────────────

/**
 * 1. Status Distribution
 * Returns array of { name, value, percentage } for each pipeline stage.
 */
export const getStatusDistribution = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const stages = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const counts = stages.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});

  leads.forEach((lead) => {
    if (!lead) return;
    const status = mapLeadStatus(lead.status);
    if (counts[status] !== undefined) counts[status]++;
  });

  const total = leads.length;
  return stages.map((stage) => ({
    name: stage,
    value: counts[stage],
    percentage: total > 0 ? Math.round((counts[stage] / total) * 100) : 0,
  }));
};

/**
 * 2. Monthly Leads Created (Last 6 months)
 */
export const getMonthlyLeads = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const months = generateLast6MonthsKeys();

  leads.forEach((lead) => {
    if (!lead || !lead.createdAt) return;
    const key = lead.createdAt.substring(0, 7);
    const m = months.find((item) => item.monthKey === key);
    if (m) m.count++;
  });

  return months.map((m) => ({ name: m.name, count: m.count }));
};

/**
 * 3. Monthly Conversion Rate (Won / Total per month)
 */
export const getConversionByMonth = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const months = generateLast6MonthsKeys();

  leads.forEach((lead) => {
    if (!lead || !lead.createdAt) return;
    const key = lead.createdAt.substring(0, 7);
    const m = months.find((item) => item.monthKey === key);
    if (m) {
      m.total++;
      if (lead.status === 'Won') m.won++;
    }
  });

  return months.map((m) => ({
    name: m.name,
    rate: m.total > 0 ? Math.round((m.won / m.total) * 100) : 0,
  }));
};

/**
 * 4. Revenue by Month (Won deals only)
 */
export const getRevenueByMonth = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const months = generateLast6MonthsKeys();

  leads.forEach((lead) => {
    if (!lead || !lead.createdAt || lead.status !== 'Won') return;
    const key = lead.createdAt.substring(0, 7);
    const m = months.find((item) => item.monthKey === key);
    if (m) m.revenue += Number(lead.value) || 0;
  });

  return months.map((m) => ({ name: m.name, revenue: m.revenue }));
};

/**
 * 5. Pipeline Value (sum of active/open leads – NOT Won/Lost)
 */
export const getPipelineValue = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l && l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

/**
 * 6. Won Revenue (sum of Won lead values)
 */
export const getWonRevenue = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l && l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

/**
 * 7. Average Sales Cycle in days (wonAt – createdAt)
 */
export const getAverageSalesCycle = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  const wonLeads = leads.filter((l) => l && l.status === 'Won');
  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let count = 0;

  wonLeads.forEach((lead) => {
    const created = parseDate(lead.createdAt);
    // Fallback: if wonAt is missing, assume won 14 days after creation
    const won =
      parseDate(lead.wonAt) ||
      (created ? new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000) : null);
    if (created && won) {
      const diffDays = (won.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays >= 0) {
        totalDays += diffDays;
        count++;
      }
    }
  });

  return count > 0 ? Math.round(totalDays / count) : 14;
};

/**
 * 8. Lost Rate (Lost / Total × 100)
 */
export const getLostRate = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  const total = leads.length;
  if (total === 0) return 0;
  const lost = leads.filter((l) => l && l.status === 'Lost').length;
  return Math.round((lost / total) * 100);
};

/**
 * 9. Lead Source Stats
 * Sources: Website, Referral, LinkedIn, Instagram, Ads, Cold Email
 * Sorted descending by count.
 */
export const getLeadSourceStats = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Ads', 'Cold Email'];
  const counts = sources.reduce((acc, src) => ({ ...acc, [src]: 0 }), {});

  leads.forEach((lead) => {
    if (!lead || !lead.source) return;
    const source = lead.source.trim();
    // Normalise legacy / variant source names
    let matched = 'Website'; // default fallback
    if (source === 'Cold Outreach' || source === 'Cold Call') {
      matched = 'Cold Email';
    } else if (source === 'Email Campaign') {
      matched = 'Cold Email';
    } else if (sources.includes(source)) {
      matched = source;
    }
    counts[matched]++;
  });

  const total = leads.length;
  return Object.keys(counts)
    .map((name) => ({
      name,
      count: counts[name],
      percentage: total > 0 ? Math.round((counts[name] / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * 10. Funnel Data (cumulative: each stage counts leads that reached at‑least that stage)
 */
export const getFunnelData = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];

  const funnelStages = [
    { key: 'New', name: 'New' },
    { key: 'Contacted', name: 'Contacted' },
    { key: 'Meeting Scheduled', name: 'Meeting Scheduled' },
    { key: 'Proposal Sent', name: 'Proposal Sent' },
    { key: 'Won', name: 'Won' },
  ];

  const stageCounts = funnelStages.map((s) => ({ name: s.name, count: 0 }));

  leads.forEach((lead) => {
    if (!lead) return;
    const mapped = mapLeadStatus(lead.status);

    if (mapped === 'New') {
      stageCounts[0].count++;
    } else if (mapped === 'Contacted') {
      stageCounts[0].count++;
      stageCounts[1].count++;
    } else if (mapped === 'Meeting Scheduled') {
      stageCounts[0].count++;
      stageCounts[1].count++;
      stageCounts[2].count++;
    } else if (mapped === 'Proposal Sent') {
      stageCounts[0].count++;
      stageCounts[1].count++;
      stageCounts[2].count++;
      stageCounts[3].count++;
    } else if (mapped === 'Won') {
      stageCounts[0].count++;
      stageCounts[1].count++;
      stageCounts[2].count++;
      stageCounts[3].count++;
      stageCounts[4].count++;
    } else if (mapped === 'Lost') {
      stageCounts[0].count++;
    }
  });

  const topValue = stageCounts[0].count;

  return stageCounts.map((item, idx) => {
    const prevCount = idx === 0 ? topValue : stageCounts[idx - 1].count;
    const dropOff = prevCount > 0 ? prevCount - item.count : 0;
    return {
      ...item,
      value: item.count,
      percentage: topValue > 0 ? Math.round((item.count / topValue) * 100) : 0,
      dropOff,
      dropOffPct: prevCount > 0 ? Math.round((dropOff / prevCount) * 100) : 0,
    };
  });
};

/**
 * 11. Sales Velocity
 * Formula: (Opportunities × Win Rate × Avg Deal Size) / Sales Cycle
 * Returns daily revenue velocity value.
 */
export const getSalesVelocity = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;

  const openOpps = leads.filter(
    (l) => l && l.status !== 'Won' && l.status !== 'Lost'
  ).length;
  const wonLeads = leads.filter((l) => l && l.status === 'Won');
  const winRate = leads.length > 0 ? wonLeads.length / leads.length : 0;
  const wonRevenue = getWonRevenue(leads);
  const avgDealSize = wonLeads.length > 0 ? wonRevenue / wonLeads.length : 5000;
  const avgSalesCycle = getAverageSalesCycle(leads) || 14;

  const velocity = (openOpps * winRate * avgDealSize) / avgSalesCycle;
  return isNaN(velocity) || !isFinite(velocity) ? 0 : Math.round(velocity);
};

/**
 * 12. Revenue Forecast
 * Average of last 6 months revenue + confidence based on proposal pipeline ratio.
 */
export const getForecastRevenue = (leads) => {
  if (!leads || !Array.isArray(leads)) return { forecast: 0, confidence: 85 };

  const monthlyRev = getRevenueByMonth(leads);
  const totalRev = monthlyRev.reduce((sum, m) => sum + m.revenue, 0);
  const avgRev = totalRev / 6;

  const activeLeads = leads.filter(
    (l) => l && l.status !== 'Won' && l.status !== 'Lost'
  );
  const proposalLeads = leads.filter(
    (l) => l && mapLeadStatus(l.status) === 'Proposal Sent'
  );

  let confidence = 85;
  if (activeLeads.length > 0) {
    confidence = Math.min(
      98,
      Math.max(60, Math.round((proposalLeads.length / activeLeads.length) * 40 + 60))
    );
  }

  return { forecast: Math.round(avgRev), confidence };
};

/**
 * 13. Top Performers (Won revenue grouped by owner, top 5)
 */
export const getTopPerformers = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];

  const ownerRevenues = {};
  leads.forEach((lead) => {
    if (!lead || lead.status !== 'Won') return;
    const ownerName = getLeadOwner(lead);
    const value = Number(lead.value) || 0;
    ownerRevenues[ownerName] = (ownerRevenues[ownerName] || 0) + value;
  });

  return Object.keys(ownerRevenues)
    .map((name) => ({ name, revenue: ownerRevenues[name] }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

/**
 * 14. Activity Heatmap Data
 * GitHub-style calendar data – tracks leads created, meetings, and won deals.
 */
export const getActivityHeatmapData = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];

  const dayCounts = {};

  leads.forEach((lead) => {
    if (!lead) return;

    // Created At event
    if (lead.createdAt) {
      const dateKey = lead.createdAt.substring(0, 10);
      dayCounts[dateKey] = (dayCounts[dateKey] || 0) + 1;
    }

    // Won At event (weighted more)
    if (lead.status === 'Won' && lead.wonAt) {
      const dateKey = lead.wonAt.substring(0, 10);
      dayCounts[dateKey] = (dayCounts[dateKey] || 0) + 1.5;
    } else if (lead.status === 'Won' && lead.createdAt) {
      const created = new Date(lead.createdAt);
      if (!isNaN(created.getTime())) {
        const fallback = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        dayCounts[fallback] = (dayCounts[fallback] || 0) + 1.5;
      }
    }

    // Meeting At event
    if (lead.meetingAt) {
      const dateKey = lead.meetingAt.substring(0, 10);
      dayCounts[dateKey] = (dayCounts[dateKey] || 0) + 1;
    }

    // Contacted At event
    if (lead.contactedAt) {
      const dateKey = lead.contactedAt.substring(0, 10);
      dayCounts[dateKey] = (dayCounts[dateKey] || 0) + 0.5;
    }
  });

  return Object.keys(dayCounts).map((date) => ({
    date,
    count: Math.round(dayCounts[date]),
  }));
};
