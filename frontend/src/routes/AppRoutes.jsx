import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Cities from "../pages/Cities";
import Hotels from "../pages/Hotels";
import Tours from "../pages/Tours";
import Clients from "../pages/Clients";
import Agents from "../pages/Agents";
import EmailCenter from "../pages/EmailCenter";
import StaffManagement from "../pages/StaffManagement";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cities" element={<Cities />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/email-center" element={<EmailCenter />} />
      <Route path="/staff-management" element={<StaffManagement />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;