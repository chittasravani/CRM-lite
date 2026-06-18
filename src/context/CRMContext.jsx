/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CRMContext = createContext();

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

// Initial Mock Data
const initialLeads = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    company: 'Apex Technologies',
    email: 'sarah.j@apextech.io',
    phone: '+1 (555) 019-2834',
    status: 'Proposal',
    value: 12500,
    source: 'LinkedIn',
    createdAt: '2026-06-01',
  },
  {
    id: 'lead-2',
    name: 'Marcus Chen',
    company: 'Sino-Global Inc',
    email: 'm.chen@sinoglobal.cn',
    phone: '+86 21 6283 9102',
    status: 'Contacted',
    value: 8200,
    source: 'Website',
    createdAt: '2026-06-05',
  },
  {
    id: 'lead-3',
    name: 'Elena Rostova',
    company: 'Nordic FinTech',
    email: 'e.rostova@nordicfin.se',
    phone: '+46 8 123 4567',
    status: 'Qualified',
    value: 24000,
    source: 'Referral',
    createdAt: '2026-06-08',
  },
  {
    id: 'lead-4',
    name: 'David Beck',
    company: 'Quantum Dynamics',
    email: 'david@quantumdynamics.com',
    phone: '+1 (555) 045-6789',
    status: 'New',
    value: 5000,
    source: 'Cold Outreach',
    createdAt: '2026-06-12',
  },
  {
    id: 'lead-5',
    name: 'Amara Okafor',
    company: 'Zetta Energy',
    email: 'amara@zetta.energy',
    phone: '+234 1 460 5555',
    status: 'New',
    value: 15000,
    source: 'LinkedIn',
    createdAt: '2026-06-14',
  },
  {
    id: 'lead-6',
    name: 'Oliver Martinez',
    company: 'Solis Solar',
    email: 'oliver@solissolar.com',
    phone: '+1 (555) 098-7654',
    status: 'Won',
    value: 18500,
    source: 'Website',
    createdAt: '2026-05-20',
  },
  {
    id: 'lead-7',
    name: 'Kenji Sato',
    company: 'Tokyo Logistics',
    email: 'k.sato@tokyolog.jp',
    phone: '+81 3 5555 0123',
    status: 'Lost',
    value: 9500,
    source: 'Cold Outreach',
    createdAt: '2026-05-18',
  }
];

const initialCustomers = [
  {
    id: 'cust-1',
    name: 'Jane Harrison',
    company: 'CloudScale Solutions',
    email: 'jane@cloudscale.net',
    phone: '+1 (555) 012-3456',
    industry: 'Tech',
    ltv: 48000,
    status: 'Active',
    joinedAt: '2025-11-12',
  },
  {
    id: 'cust-2',
    name: 'Roberto Gomez',
    company: 'Valverde Retail',
    email: 'roberto@valverderetail.es',
    phone: '+34 91 555 1234',
    industry: 'Retail',
    ltv: 15500,
    status: 'Active',
    joinedAt: '2026-01-20',
  },
  {
    id: 'cust-3',
    name: 'Aisha Al-Mutawa',
    company: 'Apex Health Systems',
    email: 'aisha@apexhealth.ae',
    phone: '+971 4 555 6789',
    industry: 'Healthcare',
    ltv: 92000,
    status: 'Active',
    joinedAt: '2025-08-05',
  },
  {
    id: 'cust-4',
    name: 'Thomas Mueller',
    company: 'Bavaria Motor Group',
    email: 'thomas.m@bmg.de',
    phone: '+49 89 555 9876',
    industry: 'Other',
    ltv: 35000,
    status: 'Trial',
    joinedAt: '2026-05-01',
  },
  {
    id: 'cust-5',
    name: 'Li Wei',
    company: 'East Gate Capital',
    email: 'li.wei@eastgate.com',
    phone: '+86 10 5555 8888',
    industry: 'Finance',
    ltv: 120000,
    status: 'Active',
    joinedAt: '2025-04-15',
  },
  {
    id: 'cust-6',
    name: 'Sophie Dubois',
    company: 'Lumiere Media',
    email: 'sophie.d@lumieremedia.fr',
    phone: '+33 1 5555 2468',
    industry: 'Education',
    ltv: 8400,
    status: 'Churned',
    joinedAt: '2025-06-10',
  }
];

const initialActivities = [
  {
    id: 'act-1',
    text: 'Sarah Jenkins was updated to status Proposal',
    timestamp: '2026-06-16T14:30:00Z',
    type: 'lead_updated',
  },
  {
    id: 'act-2',
    text: 'New lead David Beck from Quantum Dynamics was created',
    timestamp: '2026-06-12T09:15:00Z',
    type: 'lead_created',
  },
  {
    id: 'act-3',
    text: 'Oliver Martinez was converted to Customer',
    timestamp: '2026-06-10T16:45:00Z',
    type: 'lead_converted',
  },
  {
    id: 'act-4',
    text: 'New lead Amara Okafor from Zetta Energy was created via LinkedIn',
    timestamp: '2026-06-14T11:20:00Z',
    type: 'lead_created',
  }
];

export const CRMProvider = ({ children }) => {
  // Load initial data from localStorage if available, otherwise use initial mock data
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('crm_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('crm_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('crm_settings');
    return saved ? JSON.parse(saved) : {
      user: {
        name: 'Alex Rivera',
        company: 'SaaSify Inc',
        email: 'alex.rivera@saasify.io',
        role: 'CEO & Founder',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      stages: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'],
      teamMembers: [
        { id: 1, name: 'Alex Rivera', email: 'alex.rivera@saasify.io', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jessica Vance', email: 'jessica.v@saasify.io', role: 'Sales Rep', status: 'Active' },
        { id: 3, name: 'Michael K.', email: 'michael@saasify.io', role: 'Sales Rep', status: 'Inactive' }
      ],
      integrations: {
        slack: true,
        gmail: false,
        hubspot: false
      }
    };
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('crm_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('crm_settings', JSON.stringify(settings));
  }, [settings]);

  // Activity logger helper
  const addActivity = (text, type) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  // Lead CRUD & Operations
  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      value: Number(lead.value) || 0,
    };
    setLeads(prev => [newLead, ...prev]);
    addActivity(`New lead ${newLead.name} from ${newLead.company} was added`, 'lead_created');
  };

  const updateLead = (updatedLead) => {
    const oldValue = leads.find(l => l.id === updatedLead.id);
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? { ...updatedLead, value: Number(updatedLead.value) || 0 } : l));
    
    if (oldValue && oldValue.status !== updatedLead.status) {
      addActivity(`${updatedLead.name} status updated from ${oldValue.status} to ${updatedLead.status}`, 'lead_updated');
    } else {
      addActivity(`Details for lead ${updatedLead.name} were updated`, 'lead_updated');
    }
  };

  const deleteLead = (id) => {
    const leadToDelete = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (leadToDelete) {
      addActivity(`Lead ${leadToDelete.name} from ${leadToDelete.company} was deleted`, 'lead_deleted');
    }
  };

  // Convert Lead to Customer
  const convertLeadToCustomer = (leadId, industry = 'Tech') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Remove lead (or mark status as Won, let's change status to Won and copy to customers)
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Won' } : l));

    // Create new customer
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      industry: industry,
      ltv: lead.value,
      status: 'Active',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    // Check if customer already exists to avoid duplicates
    setCustomers(prev => {
      const exists = prev.some(c => c.email.toLowerCase() === lead.email.toLowerCase());
      if (exists) return prev;
      return [newCustomer, ...prev];
    });

    addActivity(`Converted lead ${lead.name} to Customer! Company: ${lead.company}`, 'lead_converted');
  };

  // Customer CRUD
  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: `cust-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
      ltv: Number(customer.ltv) || 0,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addActivity(`New customer ${newCustomer.name} from ${newCustomer.company} was added`, 'customer_created');
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? { ...updatedCustomer, ltv: Number(updatedCustomer.ltv) || 0 } : c));
    addActivity(`Customer details for ${updatedCustomer.name} were updated`, 'customer_updated');
  };

  const deleteCustomer = (id) => {
    const customerToDelete = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (customerToDelete) {
      addActivity(`Customer ${customerToDelete.name} was removed`, 'customer_deleted');
    }
  };

  // Settings modification
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    addActivity(`System and profile settings were updated`, 'settings_updated');
  };

  return (
    <CRMContext.Provider value={{
      leads,
      customers,
      activities,
      settings,
      addLead,
      updateLead,
      deleteLead,
      convertLeadToCustomer,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      updateSettings,
    }}>
      {children}
    </CRMContext.Provider>
  );
};
