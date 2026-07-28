import React, { useState, useEffect } from "react";
import {
  Plane,
  Users,
  Flame,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Filter,
  ArrowRight,
  Compass,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getDashboardData } from "../services/dashboardService";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("annual");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getDashboardData();
        if (res?.success && res?.data) {
          setStats(res.data);
        } else {
          setError(res?.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard API fetch error:", err);
        setError(err.response?.data?.message || "Could not connect to backend server");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Strict Realtime API Values (No hardcoded fallback numbers)
  const totalClients = stats?.totalClients ?? 0;
  const totalHotels = stats?.totalHotels ?? 0;
  const totalCities = stats?.totalCities ?? 0;
  const totalTours = stats?.totalTours ?? 0;
  const activeHotels = stats?.activeHotels ?? 0;
  const inactiveHotels = stats?.inactiveHotels ?? 0;

  const kpis = [
    {
      label: "TOTAL CLIENTS",
      value: totalClients,
      sub: "Registered Clients",
      icon: Users,
      theme: "blue",
    },
    {
      label: "TOTAL HOTELS",
      value: totalHotels,
      sub: "Global Partners",
      icon: Building2,
      theme: "purple",
    },
    {
      label: "TOTAL CITIES",
      value: totalCities,
      sub: "Covered Destinations",
      icon: MapPin,
      theme: "dark",
    },
    {
      label: "TOTAL TOURS",
      value: totalTours,
      sub: "Booked Packages",
      icon: Compass,
      theme: "orange",
    },
    {
      label: "ACTIVE HOTELS",
      value: activeHotels,
      sub: <span className="growth-green">Currently Live</span>,
      icon: CheckCircle2,
      theme: "green",
    },
    {
      label: "INACTIVE HOTELS",
      value: inactiveHotels,
      sub: <span className="action-red">Disabled / Inactive</span>,
      icon: Clock,
      theme: "red",
    },
  ];

  const monthlyBars = [
    { month: "JAN", darkH: "30%", lightH: "30%" },
    { month: "FEB", darkH: "70%", lightH: "20%" },
    { month: "MAR", darkH: "50%", lightH: "15%" },
    { month: "APR", darkH: "60%", lightH: "25%" },
    { month: "MAY", darkH: "10%", lightH: "60%" },
    { month: "JUN", darkH: "20%", lightH: "70%" },
  ];

  const destinations = [
    { name: "Maldives", tours: `${totalTours} tours`, progress: totalTours > 0 ? 85 : 0 },
    { name: "Santorini", tours: `${totalTours} tours`, progress: totalTours > 0 ? 65 : 0 },
    { name: "Kyoto", tours: `${totalTours} tours`, progress: totalTours > 0 ? 50 : 0 },
    { name: "Swiss Alps", tours: `${totalTours} tours`, progress: totalTours > 0 ? 40 : 0 },
    { name: "Bali", tours: `${totalTours} tours`, progress: totalTours > 0 ? 30 : 0 },
  ];

  const recentTours = [
    {
      name: "Blue Maldives Retreat",
      client: "Sarah Jenkins",
      status: "CONFIRMED",
      date: "Oct 12, 2026",
    },
    {
      name: "Tuscan Vineyard Tour",
      client: "Michael Chen",
      status: "PENDING",
      date: "Oct 14, 2026",
    },
    {
      name: "Swiss Alps Express",
      client: "Emma Wilson",
      status: "CONFIRMED",
      date: "Oct 15, 2026",
    },
    {
      name: "Kyoto Cherry Blossom",
      client: "David Miller",
      status: "CANCELLED",
      date: "Oct 18, 2026",
    },
  ];

  const communications = [
    {
      initials: "SJ",
      bg: "#2563eb",
      name: "Sarah Jenkins",
      time: "10m ago",
      snippet: "The flights for the Maldives...",
    },
    {
      initials: "JS",
      bg: "#7c3aed",
      name: "John Smith (Agent)",
      time: "2h ago",
      snippet: "New group booking for...",
    },
    {
      initials: "MR",
      bg: "#16a34a",
      name: "Marco Rossi",
      time: "5h ago",
      snippet: "Can we confirm the...",
    },
    {
      initials: "AC",
      bg: "#ea580c",
      name: "Alice Cooper",
      time: "Yesterday",
      snippet: "Payment receipt...",
    },
  ];

  return (
    <div className="dash-container">
      {/* Hero Banner */}
      <div className="dash-hero-banner">
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">Dashboard Overview</h1>
          <div className="dash-hero-badges">
            <span className="dash-badge-pill">
              <Sparkles size={14} /> {totalTours} tours in flight
            </span>
            <span className="dash-badge-pill">
              <Compass size={14} /> {activeHotels} active hotels
            </span>
          </div>
        </div>
        <Plane className="dash-plane-watermark" size={240} strokeWidth={1} />
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center p-5 text-muted gap-2">
          <Loader2 className="animate-spin text-primary" size={24} />
          <span>Loading real-time dashboard data...</span>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center gap-2 my-3 rounded-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Row (100% Realtime API Data) */}
      <div className="dash-kpi-grid">
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div key={idx} className="dash-kpi-card">
              <div className={`dash-kpi-icon-box ${kpi.theme}`}>
                <IconComp size={20} />
              </div>
              <div className="dash-kpi-label">{kpi.label}</div>
              <div className="dash-kpi-value">{kpi.value}</div>
              <div className="dash-kpi-sub">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid — Performance Chart & Tour Status Donut */}
      <div className="dash-middle-grid">
        {/* Monthly Performance */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Monthly Tours Performance</h2>
              <div className="dash-card-subtitle">
                Total bookings and inquiries per month
              </div>
            </div>
            <div className="dash-toggle-group">
              <button
                className={`dash-toggle-btn ${
                  timeframe === "6months" ? "active" : ""
                }`}
                onClick={() => setTimeframe("6months")}
              >
                Last 6 Months
              </button>
              <button
                className={`dash-toggle-btn ${
                  timeframe === "annual" ? "active" : ""
                }`}
                onClick={() => setTimeframe("annual")}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="dash-chart-bars">
            {monthlyBars.map((bar, idx) => (
              <div key={idx} className="dash-bar-col">
                <div className="dash-bar-track" style={{ height: "180px" }}>
                  <div
                    className="dash-bar-stack-light"
                    style={{ height: bar.lightH }}
                  />
                  <div
                    className="dash-bar-stack-dark"
                    style={{ height: bar.darkH }}
                  />
                </div>
                <span className="dash-bar-label">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tour Status Donut */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Tour Status</h2>
              <div className="dash-card-subtitle">
                Current inventory distribution
              </div>
            </div>
          </div>

          <div className="dash-donut-wrap">
            <svg width="160" height="160" viewBox="0 0 100 100">
              {/* Confirmed - Blue segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#2563eb"
                strokeWidth="12"
                strokeDasharray="148 90"
                strokeDashoffset="0"
              />
              {/* In Progress - Orange segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#ea580c"
                strokeWidth="12"
                strokeDasharray="67 171"
                strokeDashoffset="-148"
              />
              {/* Pending - Light segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#cbd5e1"
                strokeWidth="12"
                strokeDasharray="24 214"
                strokeDashoffset="-215"
              />
            </svg>

            <div className="dash-donut-center">
              <div className="dash-donut-num">{totalHotels}</div>
              <div className="dash-donut-text">TOTAL</div>
            </div>
          </div>

          <div className="dash-legend-list">
            <div className="dash-legend-item">
              <div className="dash-legend-label">
                <span className="dash-legend-dot" style={{ background: "#2563eb" }} />
                Active Hotels
              </div>
              <div className="dash-legend-percent">{activeHotels}</div>
            </div>

            <div className="dash-legend-item">
              <div className="dash-legend-label">
                <span className="dash-legend-dot" style={{ background: "#ea580c" }} />
                Inactive Hotels
              </div>
              <div className="dash-legend-percent">{inactiveHotels}</div>
            </div>

            <div className="dash-legend-item">
              <div className="dash-legend-label">
                <span className="dash-legend-dot" style={{ background: "#cbd5e1" }} />
                Total Tours
              </div>
              <div className="dash-legend-percent">{totalTours}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid — Popular Destinations, Recent Tours, Recent Communications */}
      <div className="dash-bottom-grid">
        {/* Popular Destinations */}
        <div className="dash-card">
          <div className="dash-section-header">POPULAR DESTINATIONS</div>

          {destinations.map((dest, idx) => (
            <div key={idx} className="dash-dest-item">
              <div className="dash-dest-info">
                <span className="dash-dest-name">{dest.name}</span>
                <span className="dash-dest-count">{dest.tours}</span>
              </div>
              <div className="dash-progress-track">
                <div
                  className="dash-progress-fill"
                  style={{ width: `${dest.progress}%` }}
                />
              </div>
            </div>
          ))}

          <a href="#destinations" className="dash-link-action">
            View All Destinations <ArrowRight size={14} />
          </a>
        </div>

        {/* Recent Tours */}
        <div className="dash-card">
          <div className="dash-section-header">
            <span>RECENT TOURS</span>
            <Filter size={15} style={{ cursor: "pointer", color: "#94a3b8" }} />
          </div>

          <table className="dash-table">
            <thead>
              <tr>
                <th>TOUR NAME</th>
                <th>CLIENT</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {recentTours.map((tour, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="dash-tour-name">
                      <div className="dash-tour-icon">
                        <Compass size={14} />
                      </div>
                      {tour.name}
                    </div>
                  </td>
                  <td style={{ color: "#475569" }}>{tour.client}</td>
                  <td>
                    <span
                      className={`dash-status-badge ${tour.status.toLowerCase()}`}
                    >
                      {tour.status}
                    </span>
                  </td>
                  <td style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    {tour.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "center", marginTop: "14px" }}>
            <a href="#audit" className="dash-link-action">
              See full audit log
            </a>
          </div>
        </div>

        {/* Recent Communications */}
        <div className="dash-card">
          <div className="dash-section-header">RECENT COMMUNICATIONS</div>

          <div className="dash-comm-list">
            {communications.map((comm, idx) => (
              <div key={idx} className="dash-comm-item">
                <div
                  className="dash-comm-avatar"
                  style={{ background: comm.bg }}
                >
                  {comm.initials}
                </div>
                <div className="dash-comm-content">
                  <div className="dash-comm-header">
                    <span className="dash-comm-name">{comm.name}</span>
                    <span className="dash-comm-time">{comm.time}</span>
                  </div>
                  <div className="dash-comm-snippet">{comm.snippet}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="dash-inbox-btn">Open Inbox (12)</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;