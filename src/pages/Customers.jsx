import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Building, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); // null for Add, object for Edit
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: 'Tech',
    ltv: '',
    status: 'Active'
  });

  const industries = ['All', 'Tech', 'Finance', 'Healthcare', 'Retail', 'Education', 'Other'];

  // Filter customers
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = industryFilter === 'All' || cust.industry === industryFilter;

    return matchesSearch && matchesIndustry;
  });

  // Open modal for add
  const handleOpenAdd = () => {
    setCurrentCustomer(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      industry: 'Tech',
      ltv: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (cust) => {
    setCurrentCustomer(cust);
    setFormData({
      name: cust.name,
      company: cust.company,
      email: cust.email,
      phone: cust.phone,
      industry: cust.industry,
      ltv: cust.ltv,
      status: cust.status
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

    if (currentCustomer) {
      updateCustomer({ ...currentCustomer, ...formData });
      toast.success('Customer details updated');
    } else {
      addCustomer(formData);
      toast.success('Customer added successfully');
    }
    setIsModalOpen(false);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this customer? This action is permanent.')) {
      deleteCustomer(id);
      toast.success('Customer removed successfully');
    }
  };

  // Status Badge Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Trial': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Churned': return 'bg-slate-50 text-slate-500 border-slate-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>

          {/* Industry Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-transparent pr-1 outline-none cursor-pointer"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Customer Button */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {/* Customers List Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Lifetime Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((cust) => (
                <tr 
                  key={cust.id} 
                  className="group hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleOpenEdit(cust)}
                >
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">
                        {cust.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{cust.name}</p>
                        <p className="text-[10px] text-slate-400">Customer since {cust.joinedAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      {cust.company}
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="rounded-lg bg-indigo-50/50 border border-indigo-100/50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {cust.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-xs font-bold text-slate-800">
                    ${cust.ltv.toLocaleString()}
                  </td>
                  <td className="px-6 py-4.5">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${getStatusColor(cust.status)}`}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col gap-0.5 text-[10px] text-slate-500" onClick={(e) => e.stopPropagation()}>
                      <a href={`mailto:${cust.email}`} className="flex items-center gap-1 hover:text-indigo-600">
                        <Mail className="h-3 w-3 text-slate-400" /> {cust.email}
                      </a>
                      <a href={`tel:${cust.phone}`} className="flex items-center gap-1 hover:text-indigo-600">
                        <Phone className="h-3 w-3 text-slate-400" /> {cust.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                        title="Edit Customer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {currentCustomer ? 'Edit Customer Details' : 'Add New Customer'}
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
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Customer Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Jane Doe"
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
                    placeholder="E.g. CloudScale Solutions"
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
                    placeholder="jane@company.com"
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

              {/* LTV / Industry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Lifetime Value ($)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      placeholder="12000"
                      value={formData.ltv}
                      onChange={(e) => setFormData({ ...formData, ltv: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-9 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    {industries.filter(i => i !== 'All').map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Customer Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Trial">Trial</option>
                  <option value="Churned">Churned</option>
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
                  {currentCustomer ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
