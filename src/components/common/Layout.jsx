import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useCRM } from '../../context/CRMContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { settings } = useCRM();

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/leads')) return 'Lead Pipeline';
    if (path.includes('/customers')) return 'Customer Directory';
    if (path.includes('/settings')) return 'System Settings';
    return 'CRM Lite';
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-800">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
          {/* Left section: Hamburger Menu & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-800 lg:hidden shadow-sm"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          {/* Right section: Search, Actions, Profile */}
          <div className="flex items-center gap-3">
            {/* Search (Decorative for now, look clean) */}
            <div className="relative hidden md:block w-64">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Quick search..."
                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Notification Badge */}
            <button 
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 shadow-sm"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5 animate-pulse" />
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>

            {/* Mini User Profile */}
            <div className="flex items-center gap-2">
              <img
                src={settings.user.avatar}
                alt={settings.user.name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-indigo-50"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-800">{settings.user.name}</p>
                <p className="text-[10px] font-medium text-slate-400">{settings.user.company}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
