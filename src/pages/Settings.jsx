import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  User, 
  Building, 
  Mail, 
  Shield, 
  Plus, 
  MessageSquare,
  Sliders,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { settings, updateSettings } = useCRM();
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: settings.user.name,
    role: settings.user.role,
    company: settings.user.company,
    email: settings.user.email,
    avatar: settings.user.avatar
  });

  // Integrations Toggles
  const handleToggleIntegration = (key) => {
    const updatedIntegrations = {
      ...settings.integrations,
      [key]: !settings.integrations[key]
    };
    updateSettings({
      ...settings,
      integrations: updatedIntegrations
    });
    toast.success(`${key.toUpperCase()} integration state updated`);
  };

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      user: profileForm
    });
    toast.success('Profile settings updated successfully!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Grids for Settings categories */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Sidebar help text */}
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold text-slate-800">User Profile</h3>
          <p className="mt-1 text-xs text-slate-400">Update your account settings, company details, and display avatar.</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={profileForm.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                alt="Avatar Preview"
                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-indigo-50"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Avatar URL</label>
                <input
                  type="text"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className="w-full sm:w-80 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-10 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role / Position</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Shield className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-10 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-10 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pl-10 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50 mt-6">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:shadow-lg transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Team Management Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold text-slate-800">Team Collaborators</h3>
          <p className="mt-1 text-xs text-slate-400">Manage user authorization and workspace members access levels.</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Members ({settings.teamMembers.length})</h4>
            <button 
              type="button"
              onClick={() => toast.error('Workspace seat limit reached in Lite mode.')}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" /> Invite Member
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {settings.teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600 text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800">{member.name}</h5>
                    <p className="text-[10px] text-slate-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-500">{member.role}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                    member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Pipeline Config section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold text-slate-800">Pipeline Customization</h3>
          <p className="mt-1 text-xs text-slate-400">Configure visual status stages of leads pipeline.</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deal Workflow Progression</h4>
            <p className="text-[11px] text-slate-400">These columns form the stages inside the leads Kanban Board.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {settings.stages.map((stage, index) => (
              <div 
                key={stage} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-50 text-[10px] text-indigo-600 font-bold">
                  {index + 1}
                </span>
                {stage}
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Integrations Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold text-slate-800">Connected Services</h3>
          <p className="mt-1 text-xs text-slate-400">Manage connections to third party tools and productivity suites.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-2">
          {/* Slack Integration */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-xs font-bold text-slate-800">Slack Notifications</h4>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Receive lead conversion events alerts in Slack channel.</p>
            </div>
            
            <button
              type="button"
              onClick={() => handleToggleIntegration('slack')}
              className={`mt-4 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold transition-all ${
                settings.integrations.slack 
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-150 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {settings.integrations.slack ? (
                <>
                  <Check className="h-3 w-3" /> Connected
                </>
              ) : 'Connect Slack'}
            </button>
          </div>

          {/* Gmail integration */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Mail className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-xs font-bold text-slate-800">Gmail Outreach</h4>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Sync thread conversations directly under lead activities.</p>
            </div>

            <button
              type="button"
              onClick={() => handleToggleIntegration('gmail')}
              className={`mt-4 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold transition-all ${
                settings.integrations.gmail 
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-150 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {settings.integrations.gmail ? (
                <>
                  <Check className="h-3 w-3" /> Connected
                </>
              ) : 'Connect Gmail'}
            </button>
          </div>

          {/* HubSpot sync */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Sliders className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-xs font-bold text-slate-800">HubSpot Contacts</h4>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Two-way synchronization for enterprise deals contacts.</p>
            </div>

            <button
              type="button"
              onClick={() => handleToggleIntegration('hubspot')}
              className={`mt-4 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold transition-all ${
                settings.integrations.hubspot 
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-150 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {settings.integrations.hubspot ? (
                <>
                  <Check className="h-3 w-3" /> Connected
                </>
              ) : 'Connect HubSpot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
