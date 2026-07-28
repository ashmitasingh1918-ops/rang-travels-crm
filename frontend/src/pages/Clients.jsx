import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getClients } from "../services/clientService";
import { getCities } from "../services/cityService";

// Import subcomponents
import ClientStats from "./Clients/ClientStats";
import ClientToolbar from "./Clients/ClientToolbar";
import ClientTable from "./Clients/ClientTable";
import ClientDetailsDrawer from "./Clients/ClientDetailsDrawer";

function Clients() {
  // Query Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Data States
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [cities, setCities] = useState([]);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // UI Flow States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Drawer States
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1. Debounce Search Term (prevents heavy API slamming)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      // Reset to page 1 on new search
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset to page 1 when city filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [selectedCity]);

  // 2. Fetch Cities list once on Mount
  useEffect(() => {
    const fetchCitiesList = async () => {
      try {
        const response = await getCities();
        if (response.success && Array.isArray(response.data)) {
          setCities(response.data);
        }
      } catch (err) {
        console.error("Error loading cities in client list:", err);
      }
    };
    fetchCitiesList();
  }, []);

  // 3. Fetch Clients (driven by debouncedSearch, selectedCity, and currentPage)
  const fetchClientData = async (showRefreshToast = false) => {
    setIsLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        page: pagination.currentPage,
        limit: pagination.limit,
      };
      if (selectedCity) {
        params.cityId = Number(selectedCity);
      }

      const response = await getClients(params);
      if (response.success && response.data) {
        setClients(response.data.clients || []);
        setStats(response.data.stats || null);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalPages: response.data.pagination.totalPages || 1,
            totalItems: response.data.pagination.totalItems || 0,
          }));
        }
        if (showRefreshToast) {
          toast.success("Client data synchronized successfully!");
        }
      } else {
        toast.error("Failed to load client database.");
      }
    } catch (err) {
      console.error("Error loading client database:", err);
      toast.error("An error occurred while loading clients.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [debouncedSearch, selectedCity, pagination.currentPage]);

  // 4. Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchClientData(true);
  };

  // 5. CSV Export Action
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch all clients matching current filters (high limit to grab all pages)
      const params = {
        search: debouncedSearch,
        page: 1,
        limit: 100000,
      };
      if (selectedCity) {
        params.cityId = Number(selectedCity);
      }

      const response = await getClients(params);
      if (!response.success || !response.data || !response.data.clients) {
        toast.error("Failed to retrieve data for export.");
        setIsExporting(false);
        return;
      }

      const exportList = response.data.clients;
      if (exportList.length === 0) {
        toast.warning("No client records available to export.");
        setIsExporting(false);
        return;
      }

      // Escape helper matching RFC-4180
      const escapeCsv = (val) => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const headers = [
        "Client Name",
        "Phone",
        "Email",
        "City",
        "Address",
        "Latest Destination",
        "Latest Package",
        "Travel Date",
        "Trip Status",
        "Payment Status",
        "Total Tours Booked",
      ];

      const rows = exportList.map((c) => {
        const latestTour = c.tours && c.tours.length > 0 ? c.tours[0] : null;
        return [
          c.fullName,
          c.phone,
          c.email || "",
          c.city?.name || "",
          c.address || "",
          latestTour?.destination || "",
          latestTour?.packageName || "",
          latestTour?.travelDate ? new Date(latestTour.travelDate).toISOString().split("T")[0] : "",
          latestTour?.tripStatus || "",
          latestTour?.paymentStatus || "",
          c.tours?.length || 0,
        ].map(escapeCsv).join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `rang_travels_clients_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${exportList.length} clients to CSV.`);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error("Failed to compile CSV file.");
    } finally {
      setIsExporting(false);
    }
  };

  // 6. Pagination Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // 7. Drawer Handlers
  const handleOpenDetails = (id) => {
    setSelectedClientId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDrawerOpen(false);
    setSelectedClientId(null);
  };

  const isFiltered = !!(searchTerm || selectedCity);

  return (
    <div className="container-fluid p-0">
      {/* Header Segment */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Clients</h1>
          <p className="text-secondary mb-0 fs-7">
            Consolidated directory of your travelers, status tracking, and trip history.
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <ClientStats stats={stats} isLoading={isLoading && !isRefreshing} />

      {/* Filter and Actions Toolbar */}
      <ClientToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        cities={cities}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />

      {/* Client Table */}
      <ClientTable
        clients={clients}
        isLoading={isLoading && !isRefreshing}
        onOpenDetails={handleOpenDetails}
        isFiltered={isFiltered}
      />

      {/* Pagination Controls */}
      {clients.length > 0 && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-light-subtle mb-4">
          <span className="text-secondary fs-7">
            Showing Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems} entries)
          </span>

          <nav aria-label="Client table pagination">
            <ul className="pagination mb-0 gap-1.5">
              {/* Prev */}
              <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="btn btn-sm btn-light border border-light-subtle px-3 py-2 rounded-lg fs-7 transition-click text-secondary fw-semibold"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Previous
                </button>
              </li>

              {/* Page Number Pills */}
              {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Render truncated page items if too many (optional, but keep it simple here)
                return (
                  <li className="page-item" key={pageNum}>
                    <button
                      className={`btn btn-sm px-3.5 py-2 rounded-lg fs-7 fw-semibold ${
                        pagination.currentPage === pageNum
                          ? "btn-primary shadow-sm"
                          : "btn-light border border-light-subtle text-secondary"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}

              {/* Next */}
              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}`}>
                <button
                  className="btn btn-sm btn-light border border-light-subtle px-3 py-2 rounded-lg fs-7 transition-click text-secondary fw-semibold"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Details Slide-Over Drawer */}
      <ClientDetailsDrawer
        clientId={selectedClientId}
        isOpen={isDrawerOpen}
        onClose={handleCloseDetails}
        onUpdateSuccess={fetchClientData}
      />
    </div>
  );
}

export default Clients;
