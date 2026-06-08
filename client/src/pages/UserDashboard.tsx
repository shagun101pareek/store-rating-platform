import { useCallback, useEffect, useMemo, useState } from "react";
import { UserLayout } from "../layouts/AppLayout";
import StoreCard from "../components/StoreCard";
import RatingModal from "../components/RatingModal";
import Pagination from "../components/ui/Pagination";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { fetchStores } from "../services/storeService";
import { createRating, updateRating } from "../services/ratingService";
import { ChevronDownIcon, FilterIcon, SearchIcon } from "../components/icons";
import type { NameSortOrder, StoreListing } from "../types/api";

const ITEMS_PER_PAGE = 9;

const UserDashboard = () => {
  const [stores, setStores] = useState<StoreListing[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<NameSortOrder>("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState<StoreListing | null>(null);

  const loadStores = useCallback(
    async (searchQuery?: string, order: NameSortOrder = "asc") => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchStores({
          search: searchQuery || undefined,
          sortBy: "name",
          order,
        });
        setStores(data);
        setCurrentPage(1);
      } catch {
        setError("Failed to load stores.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadStores(search, sortOrder);
  }, [search, sortOrder, loadStores]);

  const totalPages = Math.max(1, Math.ceil(stores.length / ITEMS_PER_PAGE));

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return stores.slice(start, start + ITEMS_PER_PAGE);
  }, [stores, currentPage]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleHeaderSearch = () => {
    setSearchInput(headerSearch);
    setSearch(headerSearch.trim());
  };

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

    await loadStores(search, sortOrder);
  };

  return (
    <UserLayout
      searchValue={headerSearch}
      onSearchChange={setHeaderSearch}
      onSearchSubmit={handleHeaderSearch}
    >
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by store name or address..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-400"
          >
            <FilterIcon className="h-4 w-4" />
            Advanced Filters
          </button>
        </form>
      </div>

      {!loading && !error && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {stores.length} store{stores.length !== 1 ? "s" : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sort by name:
            </span>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as NameSortOrder)
                }
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingState message="Loading stores..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => loadStores(search, sortOrder)} />
      )}

      {!loading && !error && stores.length === 0 && (
        <EmptyState
          title="No stores found"
          message={
            search
              ? "Try adjusting your search terms."
              : "There are no stores available yet."
          }
        />
      )}

      {!loading && !error && stores.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRate={setSelectedStore}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={stores.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </>
      )}

      <RatingModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onSubmit={handleRatingSubmit}
      />
    </UserLayout>
  );
};

export default UserDashboard;
