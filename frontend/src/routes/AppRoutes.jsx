import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Cities from "../pages/Cities";
import Hotels from "../pages/Hotels";
import Tours from "../pages/Tours";

function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
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
      <Route path="/tours" element={<Tours />} />

      <Route
        path="/clients"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">Clients</h1>
            <p className="text-secondary fs-7">
              Client accounts database.
            </p>
          </div>
        }
      />

      <Route
        path="/agents"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">Agents</h1>
            <p className="text-secondary fs-7">
              Partner agent networks configuration.
            </p>
          </div>
        }
      />

      <Route
        path="/email-center"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">
              Email Center
            </h1>
            <p className="text-secondary fs-7">
              Send alerts and newsletters to customers.
            </p>
          </div>
        }
      />

      <Route
        path="/staff-management"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">
              Staff Management
            </h1>
            <p className="text-secondary fs-7">
              Manage admin users and role permissions.
            </p>
          </div>
        }
      />

      <Route
        path="/reports"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">Reports</h1>
            <p className="text-secondary fs-7">
              Performance analytics dashboard.
            </p>
          </div>
        }
      />

      <Route
        path="/settings"
        element={
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-dark font-weight-bold">Settings</h1>
            <p className="text-secondary fs-7">
              Update CRM preferences and configurations.
            </p>
          </div>
        }
      />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;