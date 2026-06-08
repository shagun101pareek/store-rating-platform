import { useCallback, useEffect, useMemo, useState } from "react";
import { UserLayout } from "../layouts/AppLayout";
import RatingModal from "../components/RatingModal";
import StarRating from "../components/ui/StarRating";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { fetchStores } from "../services/storeService";
import { createRating, updateRating } from "../services/ratingService";
import type { StoreListing } from "../types/api";

const MyRatings = () => {
  const [stores, setStores] = useState<StoreListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreListing | null>(null);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchStores({ sortBy: "name", order: "asc" });
      setStores(data);
    } catch {
      setError("Failed to load your ratings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const ratedStores = useMemo(
    () => stores.filter((store) => store.hasRated),
    [stores]
  );

  const handleRatingSubmit = async (
    storeId: string,
    rating: number,
    isUpdate: boolean
  ) => {
    if (isUpdate) {
      await updateRating(storeId, rating);
    } else {
      await createRating(storeId, rating);
    }

    await loadStores();
  };

  return (
    <UserLayout title="My Ratings" showSearch={false}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Ratings</h1>
        <p className="mt-1 text-slate-500">
          All stores you have rated
        </p>
      </div>

      {loading && <LoadingState message="Loading your ratings..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadStores} />
      )}

      {!loading && !error && ratedStores.length === 0 && (
        <EmptyState
          title="No ratings yet"
          message="You haven't rated any stores yet. Explore stores to submit your first rating."
        />
      )}

      {!loading && !error && ratedStores.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Store Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    My Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Average Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ratedStores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {store.address}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={store.userRating ?? 0} size="sm" />
                        <span className="text-sm font-semibold text-slate-900">
                          {store.userRating}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {store.averageRating}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedStore(store)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Update Rating
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RatingModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onSubmit={handleRatingSubmit}
      />
    </UserLayout>
  );
};

export default MyRatings;
