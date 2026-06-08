import { useEffect, useState } from "react";
import { OwnerLayout } from "../layouts/AppLayout";
import OwnerRatings from "./OwnerRatings";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import { fetchOwnerDashboard } from "../services/ownerService";

const OwnerReviews = () => {
  const [storeName, setStoreName] = useState<string | null>(null);
  const [hasStore, setHasStore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStoreInfo = async () => {
    setLoading(true);
    setError("");

    try {
      const dashboard = await fetchOwnerDashboard();
      setStoreName(dashboard.storeName);
      setHasStore(dashboard.hasStore !== false);
    } catch {
      setError("Failed to load store information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreInfo();
  }, []);

  return (
    <OwnerLayout storeName={storeName ?? undefined}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Customer Reviews</h1>
        <p className="mt-1 text-slate-500">
          View and manage all ratings submitted by your customers.
        </p>
        {storeName && (
          <p className="mt-2 text-sm font-semibold text-blue-600">{storeName}</p>
        )}
      </div>

      {loading && <LoadingState message="Loading reviews..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadStoreInfo} />
      )}

      {!loading && !error && !hasStore && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-800">
          No store is linked to your account yet. Ask an admin to register your
          store from the admin panel.
        </div>
      )}

      {!loading && !error && hasStore && <OwnerRatings />}
    </OwnerLayout>
  );
};

export default OwnerReviews;
