import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Cities from "../pages/Cities";
import Hotels from "../pages/Hotels";

function AppRoutes() {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">
              Dashboard
            </h1>
            <p className="text-secondary fs-7">
              Overview of your operations data and stats.
            </p>
          </div>
        }
      />

      {/* CRM Pages */}
      <Route path="/cities" element={<Cities />} />
      <Route path="/hotels" element={<Hotels />} />

      <Route
        path="/tours"
        element={<div className="container-fluid"><h1>Tours</h1></div>}
      />

      <Route
        path="/clients"
        element={<div className="container-fluid"><h1>Clients</h1></div>}
      />

      <Route
        path="/agents"
        element={<div className="container-fluid"><h1>Agents</h1></div>}
      />

      <Route
        path="/email-center"
        element={<div className="container-fluid"><h1>Email Center</h1></div>}
      />

      <Route
        path="/staff-management"
        element={<div className="container-fluid"><h1>Staff Management</h1></div>}
      />

      <Route
        path="/reports"
        element={<div className="container-fluid"><h1>Reports</h1></div>}
      />

      <Route
        path="/settings"
        element={<div className="container-fluid"><h1>Settings</h1></div>}
      />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;