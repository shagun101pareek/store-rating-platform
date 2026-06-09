import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../layouts/AppLayout";
import MetricCard from "../components/ui/MetricCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import { fetchAdminDashboard } from "../services/adminService";
import {
  PlusIcon,
  RatingsStarIcon,
  StoreIcon,
  UsersIcon,
} from "../components/icons";
import type { AdminDashboardData } from "../types/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminDashboard();
      setDashboard(data);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6 min-w-0 sm:mb-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Platform overview
        </p>
      </div>

      {loading && <LoadingState message="Loading dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadDashboard} />
      )}

      {!loading && !error && dashboard && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <MetricCard
              label="Total Users"
              value={dashboard.totalUsers.toLocaleString()}
              icon={<UsersIcon className="h-5 w-5" />}
            />
            <MetricCard
              label="Total Stores"
              value={dashboard.totalStores.toLocaleString()}
              icon={<StoreIcon className="h-5 w-5" />}
            />
            <MetricCard
              label="Total Ratings"
              value={dashboard.totalRatings.toLocaleString()}
              icon={<RatingsStarIcon className="h-5 w-5" />}
              iconBg="bg-amber-50 text-amber-500"
            />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Shortcuts</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/admin/stores/new"
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <PlusIcon className="h-5 w-5 text-blue-600" />
                Register New Store
              </Link>
              <Link
                to="/admin/users/new"
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <PlusIcon className="h-5 w-5 text-blue-600" />
                Create New User
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
