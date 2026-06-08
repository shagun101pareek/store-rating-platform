import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../layouts/AppLayout";
import MetricCard from "../components/ui/MetricCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import UnavailableData from "../components/ui/UnavailableData";
import { fetchAdminDashboard } from "../services/adminService";
import {
  DocumentIcon,
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Welcome back, here&apos;s what&apos;s happening with the platform today.
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
              subtitle="From last month"
              icon={<UsersIcon className="h-5 w-5" />}
            />
            <MetricCard
              label="Total Stores"
              value={dashboard.totalStores.toLocaleString()}
              subtitle="New stores added"
              icon={<StoreIcon className="h-5 w-5" />}
            />
            <MetricCard
              label="Total Ratings"
              value={dashboard.totalRatings.toLocaleString()}
              subtitle="Global reviews"
              icon={<RatingsStarIcon className="h-5 w-5" />}
              iconBg="bg-amber-50 text-amber-500"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <UnavailableData />
              </div>
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
                <UnavailableData />
                <p className="max-w-sm text-sm text-slate-400">
                  Activity feed requires a dedicated activity log API endpoint.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-sm">
                <h3 className="text-lg font-bold">Platform Status</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">
                  <UnavailableData className="!text-blue-200 !not-italic" />
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-5 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white opacity-60"
                >
                  View History
                </button>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Common Tasks
                </p>
                <div className="space-y-3">
                  <Link
                    to="/admin/stores/new"
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <PlusIcon className="h-5 w-5 text-blue-600" />
                    Register New Store
                  </Link>
                  <Link
                    to="/admin/users/new"
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <PlusIcon className="h-5 w-5 text-blue-600" />
                    Create New User
                  </Link>
                  <button
                    type="button"
                    disabled
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-left text-sm font-medium text-slate-400 shadow-sm"
                  >
                    <DocumentIcon className="h-5 w-5" />
                    Export Monthly Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
