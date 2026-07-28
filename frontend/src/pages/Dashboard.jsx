import React, { useState, useEffect } from "react";
import { Users, Building2, MapPin, Compass, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { getDashboardData } from "../services/dashboardService";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getDashboardData();
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError(res.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || err.message || "Failed to connect to dashboard API");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cardConfig = [
    {
      title: "Total Clients",
      value: stats?.totalClients ?? 0,
      description: "Registered Clients",
      icon: Users,
      iconClass: "icon-blue",
    },
    {
      title: "Total Hotels",
      value: stats?.totalHotels ?? 0,
      description: "Partner Hotels",
      icon: Building2,
      iconClass: "icon-purple",
    },
    {
      title: "Total Cities",
      value: stats?.totalCities ?? 0,
      description: "Covered Destinations",
      icon: MapPin,
      iconClass: "icon-orange",
    },
    {
      title: "Total Tours",
      value: stats?.totalTours ?? 0,
      description: "Booked Packages",
      icon: Compass,
      iconClass: "icon-teal",
    },
    {
      title: "Active Hotels",
      value: stats?.activeHotels ?? 0,
      description: "Operational Hotels",
      icon: CheckCircle2,
      iconClass: "icon-green",
    },
    {
      title: "Inactive Hotels",
      value: stats?.inactiveHotels ?? 0,
      description: "Disabled Hotels",
      icon: XCircle,
      iconClass: "icon-rose",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="mb-4">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, <strong>{user?.fullName || "User"}</strong> ({user?.role || "STAFF"})
        </p>
      </div>

      {loading && (
        <div className="dashboard-state-box">
          <Loader2 className="animate-spin text-primary" size={24} />
          <span>Loading dashboard statistics...</span>
        </div>
      )}

      {error && !loading && (
        <div className="dashboard-error-box mb-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="dashboard-stats-grid">
          {cardConfig.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="dashboard-stat-card">
                <div className={`dashboard-stat-icon ${card.iconClass}`}>
                  <IconComponent size={26} />
                </div>
                <div>
                  <div className="dashboard-stat-label">{card.title}</div>
                  <div className="dashboard-stat-value">{card.value}</div>
                  <div className="dashboard-stat-desc">{card.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;