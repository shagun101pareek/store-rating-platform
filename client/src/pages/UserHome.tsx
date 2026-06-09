import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UserLayout, getStoredUserProfile } from "../layouts/AppLayout";
import MetricCard from "../components/ui/MetricCard";
import StarRating from "../components/ui/StarRating";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { fetchStores } from "../services/storeService";
import {
  CompassIcon,
  MyRatingsIcon,
  RatingsStarIcon,
  SettingsIcon,
  StoreIcon,
} from "../components/icons";
import type { StoreListing } from "../types/api";

const UserHome = () => {
  const user = getStoredUserProfile();
  const [stores, setStores] = useState<StoreListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStores = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchStores({ sortBy: "name", order: "asc" });
      setStores(data);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const ratedStores = useMemo(
    () => stores.filter((store) => store.hasRated && store.userRating !== null),
    [stores]
  );

  const averageRatingGiven = useMemo(() => {
    if (ratedStores.length === 0) return "0.0";
    const total = ratedStores.reduce(
      (sum, store) => sum + (store.userRating ?? 0),
      0
    );
    return (total / ratedStores.length).toFixed(1);
  }, [ratedStores]);

  return (
    <UserLayout title="Home" showSearch={false}>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Hi, {user?.name || "there"}
        </h1>
        <p className="mt-1 text-slate-500">{user?.email || ""}</p>
      </div>

      {loading && <LoadingState message="Loading your dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadStores} />
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <MetricCard
              label="Stores"
              value={stores.length.toLocaleString()}
              icon={<StoreIcon className="h-5 w-5" />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <MetricCard
              label="Rated by you"
              value={ratedStores.length.toLocaleString()}
              icon={<MyRatingsIcon className="h-5 w-5" />}
              iconBg="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
              label="Your avg. rating"
              value={averageRatingGiven}
              subtitle={ratedStores.length === 0 ? "No ratings yet" : undefined}
              icon={<RatingsStarIcon className="h-5 w-5" />}
              iconBg="bg-amber-50 text-amber-500"
            />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Shortcuts</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                to="/stores"
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <CompassIcon className="h-5 w-5 text-blue-600" />
                Explore Stores
              </Link>
              <Link
                to="/my-ratings"
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <MyRatingsIcon className="h-5 w-5 text-blue-600" />
                My Ratings
              </Link>
              <Link
                to="/change-password"
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <SettingsIcon className="h-5 w-5 text-blue-600" />
                Change Password
              </Link>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-bold text-slate-900">Recent Ratings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Stores you have rated
              </p>
            </div>

            {ratedStores.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No ratings yet"
                  message="You haven't rated any stores yet."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                        Store
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                        My Rating
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                        Avg Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ratedStores.slice(0, 5).map((store) => (
                      <tr key={store.id} className="hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm font-semibold text-slate-900">
                          {store.name}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">
                          {store.address}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center gap-2">
                            <StarRating rating={store.userRating ?? 0} size="sm" />
                            <span className="text-sm font-semibold text-slate-900">
                              {store.userRating}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">
                          {store.averageRating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </UserLayout>
  );
};

export default UserHome;
