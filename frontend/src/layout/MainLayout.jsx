import React from "react";
import Sidebar from "../components/common/Sidebar";
import AppRoutes from "../routes/AppRoutes";

function MainLayout() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar container */}
      <Sidebar />

      {/* Main scrolling viewport content */}
      <main className="flex-grow-1 p-4 overflow-auto" style={{ height: "100vh" }}>
        <AppRoutes />
      </main>
    </div>
  );
}

export default MainLayout;