import { useEffect, useState } from "react";
import { OwnerLayout } from "../layouts/AppLayout";
import MetricCard from "../components/ui/MetricCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import { fetchOwnerDashboard } from "../services/ownerService";
import { RatingsStarIcon, UsersIcon } from "../components/icons";
import type { OwnerDashboardData } from "../types/api";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchOwnerDashboard();
      setDashboard(data);
    } catch {
      setError("Failed to load store analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const averageRatingDisplay = dashboard
    ? dashboard.averageRating.toFixed(1)
    : "0.0";

  return (
    <OwnerLayout storeName={dashboard?.storeName ?? undefined}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Store Analytics</h1>
        <p className="mt-1 text-slate-500">
          Track your store performance and customer satisfaction at a glance.
        </p>
        {dashboard?.storeName && (
          <p className="mt-2 text-sm font-semibold text-blue-600">
            {dashboard.storeName}
          </p>
        )}
      </div>

      {loading && <LoadingState message="Loading analytics..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadDashboard} />
      )}

      {!loading && !error && dashboard && dashboard.hasStore === false && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-800">
          No store is linked to your account yet. Ask an admin to register your
          store from the admin panel.
        </div>
      )}

      {!loading && !error && dashboard && dashboard.hasStore !== false && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <MetricCard
            label="Average Rating"
            value={averageRatingDisplay}
            subtitle={`${dashboard.totalRatings} total reviews`}
            icon={<RatingsStarIcon className="h-5 w-5" />}
            iconBg="bg-amber-50 text-amber-500"
            trendUnavailable={false}
          />
          <MetricCard
            label="Total Ratings"
            value={dashboard.totalRatings.toLocaleString()}
            subtitle="All time"
            icon={<UsersIcon className="h-5 w-5" />}
            iconBg="bg-blue-50 text-blue-600"
            trendUnavailable={false}
          />
        </div>
      )}
    </OwnerLayout>
  );
};

export default OwnerDashboard;
