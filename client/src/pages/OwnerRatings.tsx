import { useCallback, useEffect, useMemo, useState } from "react";
import StarRating from "../components/ui/StarRating";
import Pagination from "../components/ui/Pagination";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import SortableTableHeader from "../components/ui/SortableTableHeader";
import { fetchOwnerRatings } from "../services/ownerService";
import { SearchIcon } from "../components/icons";
import type { OwnerRating, SortOrder } from "../types/api";

const ITEMS_PER_PAGE = 10;

const OwnerRatings = () => {
  const [ratings, setRatings] = useState<OwnerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");

  const loadRatings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchOwnerRatings({
        sortBy: sortBy as "name" | "email" | "rating" | "createdAt",
        order,
      });
      setRatings(data);
    } catch {
      setError("Failed to load ratings.");
    } finally {
      setLoading(false);
    }
  }, [sortBy, order]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const filteredRatings = useMemo(() => {
    if (!searchQuery.trim()) return ratings;
    const query = searchQuery.toLowerCase();
    return ratings.filter(
      (rating) =>
        rating.user.name.toLowerCase().includes(query) ||
        rating.user.email.toLowerCase().includes(query)
    );
  }, [ratings, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRatings.length / ITEMS_PER_PAGE));

  const paginatedRatings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRatings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRatings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return <LoadingState message="Loading ratings..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadRatings} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-900">Customer Ratings</h2>
        <div className="relative max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search ratings..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {filteredRatings.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title={searchQuery ? "No matching ratings" : "No ratings yet"}
            message={
              searchQuery
                ? "Try a different search term."
                : "Customer ratings will appear here once submitted."
            }
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <SortableTableHeader
                    label="User Name"
                    column="name"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Email"
                    column="email"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Rating"
                    column="rating"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRatings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                      {rating.user.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {rating.user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={rating.rating} />
                        <span className="text-sm font-semibold text-slate-900">
                          {rating.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRatings.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}
    </div>
  );
};

export default OwnerRatings;
