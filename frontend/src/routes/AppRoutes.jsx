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
import Bookings from "../pages/Bookings";

import Profile from "../pages/Profile";
import Security from "../pages/Security";
import CompanyDetails from "../pages/CompanyDetails";

// New workflow pages
import TourDetail from "../pages/TourDetail";
import HotelResponses from "../pages/HotelResponses";
import EmailHistory from "../pages/EmailHistory";
import EmailSettings from "../pages/EmailSettings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cities" element={<Cities />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:tourId" element={<TourDetail />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/email-center" element={<EmailCenter />} />
      <Route path="/staff-management" element={<StaffManagement />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/bookings" element={<Bookings />} />

      {/* New workflow routes */}
      <Route path="/hotel-responses" element={<HotelResponses />} />
      <Route path="/email-history" element={<EmailHistory />} />
      <Route path="/email-settings" element={<EmailSettings />} />

      {/* Settings */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/profile" element={<Profile />} />
      <Route path="/settings/security" element={<Security />} />
      <Route path="/settings/company" element={<CompanyDetails />} />
      <Route path="/settings/email" element={<EmailSettings />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;