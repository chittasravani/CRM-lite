import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import Customers from '../pages/Customers';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect empty path to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Catch-all route redirects to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
