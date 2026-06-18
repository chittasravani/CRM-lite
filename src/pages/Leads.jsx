import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Plus, 
  Search, 
  Filter, 
  List, 
  Kanban, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Phone, 
  Mail, 
  DollarSign, 
  Building,
  User,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Leads() {
  const { leads, settings, addLead, updateLead, deleteLead, convertLeadToCustomer } = useCRM();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null); // null for Add, object for Edit
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    value: '',
    source: 'Website'
  });

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = stageFilter === 'All' || lead.status === stageFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStage && matchesSource;
  });

  // Unique sources for filter dropdown
  const sources = ['All', ...new Set(leads.map(l => l.source))];

  // Open modal for add
  const handleOpenAdd = () => {
    setCurrentLead(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'New',
      value: '',
      source: 'Website'
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (lead) => {
    setCurrentLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      value: lead.value,
      source: lead.source
    });
    setIsModalOpen(true);
  };

  // Handle submit (add or edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email) {
      toast.error('Please fill in name, company, and email.');
      return;
    }

    if (currentLead) {
      updateLead({ ...currentLead, ...formData });
      toast.success('Lead updated successfully');
    } else {
      addLead(formData);
      toast.success('Lead added successfully');
    }
    setIsModalOpen(false);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      toast.success('Lead deleted successfully');
    }
  };

  // Handle conversion
  const handleConvert = (leadId, leadName) => {
    convertLeadToCustomer(leadId);
    toast.success(`${leadName} converted to active customer!`);
  };

  // Stage badges colors
  const getStageColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Contacted': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'Qualified': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Proposal': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Won': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Lost': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Top Page controls) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent pr-1 outline-none cursor-pointer"
            >
              <option value="All">All Stages</option>
              {settings.stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="All">All Sources</option>
              {sources.filter(s => s !== 'All').map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Toggle buttons */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 shadow-inner">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board"
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Add Lead Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 gap-6 overflow-x-auto pb-4 md:grid-cols-3 lg:grid-cols-6 min-h-[500px]">
          {settings.stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            return (
              <div key={stage} className="flex flex-col min-w-[200px] bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{stage}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[600px] scrollbar-none">
                  {stageLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="group relative rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer"
                      onClick={() => handleOpenEdit(lead)}
                    >
                      {/* Name / Value */}
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 truncate mr-2">{lead.name}</h4>
                        <span className="text-xs font-bold text-slate-700 flex items-center shrink-0">
                          ${lead.value.toLocaleString()}
                        </span>
                      </div>

                      {/* Company */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                        <Building className="h-3 w-3 shrink-0" />
                        <span className="truncate">{lead.company}</span>
                      </div>

                      {/* Divider */}
                      <div className="my-2 border-t border-slate-50"></div>

                      {/* Footer Actions / Details */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="rounded-md bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                          {lead.source}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                          {lead.status !== 'Won' && (
                            <button
                              onClick={() => handleConvert(lead.id, lead.name)}
                              className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50"
                              title="Convert to Customer"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                            title="Edit Lead"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-200 rounded-xl text-[10px] text-slate-400">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Lead Details</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="group hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleOpenEdit(lead)}
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{lead.name}</p>
                          <p className="text-[10px] text-slate-400">Added {lead.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        {lead.company}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-xs font-bold text-slate-800">
                      ${lead.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${getStageColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col gap-0.5 text-[10px] text-slate-500" onClick={(e) => e.stopPropagation()}>
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-indigo-600">
                          <Mail className="h-3 w-3 text-slate-400" /> {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-indigo-600">
                          <Phone className="h-3 w-3 text-slate-400" /> {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.status !== 'Won' && (
                          <button
                            onClick={() => handleConvert(lead.id, lead.name)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Convert to Customer"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                          title="Edit Lead"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                      No leads match your filter parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {currentLead ? 'Edit Lead Details' : 'Add New Lead'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Lead Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="E.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-10 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="E.g. ACME Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-10 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Email / Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Value / Source */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Deal Value ($) *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="5000"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-9 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Pipeline Stage</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                >
                  {settings.stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  {currentLead ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
