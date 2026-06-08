import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../layouts/AppLayout";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import StarRating from "../components/ui/StarRating";
import SortableTableHeader from "../components/ui/SortableTableHeader";
import { fetchAdminStores } from "../services/adminService";
import { PlusIcon } from "../components/icons";
import type { AdminStore, SortOrder } from "../types/api";

const AdminStores = () => {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<SortOrder>("asc");

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminStores({
        name: nameFilter || undefined,
        email: emailFilter || undefined,
        address: addressFilter || undefined,
        sortBy: sortBy as "name" | "email" | "address" | "rating",
        order,
      });
      setStores(data);
    } catch {
      setError("Failed to load stores.");
    } finally {
      setLoading(false);
    }
  }, [nameFilter, emailFilter, addressFilter, sortBy, order]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loadStores();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Manage Stores</h1>
          <p className="mt-1 text-slate-500">View and manage all registered stores</p>
        </div>
        <Link
          to="/admin/stores/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Register Store
        </Link>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <input
          type="text"
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          placeholder="Filter by name"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
        <input
          type="text"
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.target.value)}
          placeholder="Filter by email"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
        <input
          type="text"
          value={addressFilter}
          onChange={(event) => setAddressFilter(event.target.value)}
          placeholder="Filter by address"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Apply Filters
        </button>
      </form>

      {loading && <LoadingState message="Loading stores..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadStores} />
      )}

      {!loading && !error && stores.length === 0 && (
        <EmptyState
          title="No stores found"
          message="There are no registered stores matching your filters."
        />
      )}

      {!loading && !error && stores.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <SortableTableHeader
                    label="Name"
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
                    label="Address"
                    column="address"
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
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores.map((store) => (
                  <tr key={store.id} className="transition hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm font-semibold text-slate-900">
                      {store.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">
                      {store.email}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">
                      {store.address}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={Number(store.rating)} size="sm" />
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
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStores;
