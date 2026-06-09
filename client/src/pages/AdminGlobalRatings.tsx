import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../layouts/AppLayout";
import MetricCard from "../components/ui/MetricCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import StarRating from "../components/ui/StarRating";
import SortableTableHeader from "../components/ui/SortableTableHeader";
import {
  fetchAdminDashboard,
  fetchAdminStores,
} from "../services/adminService";
import { RatingsStarIcon } from "../components/icons";
import type { AdminStore, SortOrder } from "../types/api";

const AdminGlobalRatings = () => {
  const [totalRatings, setTotalRatings] = useState(0);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [order, setOrder] = useState<SortOrder>("desc");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboard, storeList] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminStores({
          sortBy: sortBy as "name" | "email" | "address" | "rating",
          order,
        }),
      ]);
      setTotalRatings(dashboard.totalRatings);
      setStores(storeList);
    } catch {
      setError("Failed to load global ratings.");
    } finally {
      setLoading(false);
    }
  }, [sortBy, order]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder(column === "rating" ? "desc" : "asc");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Global Ratings</h1>
        <p className="mt-1 text-slate-500">
          Platform-wide rating overview across all stores
        </p>
      </div>

      {loading && <LoadingState message="Loading global ratings..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadData} />
      )}

      {!loading && !error && (
        <>
          <div className="mb-8 max-w-sm">
            <MetricCard
              label="Total Ratings"
              value={totalRatings.toLocaleString()}
              subtitle="Across all stores"
              icon={<RatingsStarIcon className="h-5 w-5" />}
              iconBg="bg-amber-50 text-amber-500"
            />
          </div>

          {stores.length === 0 ? (
            <EmptyState
              title="No store ratings yet"
              message="Ratings will appear here once customers start reviewing stores."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <SortableTableHeader
                        label="Store"
                        column="name"
                        sortBy={sortBy}
                        order={order}
                        onSort={handleSort}
                      />
                      <SortableTableHeader
                        label="Address"
                        column="address"
                        sortBy={sortBy}
                        order={order}
                        onSort={handleSort}
                      />
                      <SortableTableHeader
                        label="Average Rating"
                        column="rating"
                        sortBy={sortBy}
                        order={order}
                        onSort={handleSort}
                      />
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stores.map((store) => (
                      <tr
                        key={store.id}
                        className="transition hover:bg-slate-50/50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm font-semibold text-slate-900">
                          {store.name}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">
                          {store.address}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={Number(store.rating)}
                              size="sm"
                            />
                            <span className="text-sm font-semibold text-slate-900">
                              {store.rating}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                          <Link
                            to={`/admin/stores/${store.id}`}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View Store
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminGlobalRatings;
