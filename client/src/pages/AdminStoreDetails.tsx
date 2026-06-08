import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminLayout } from "../layouts/AppLayout";
import StarRating from "../components/ui/StarRating";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import { fetchAdminStoreById } from "../services/adminService";
import type { AdminStoreDetail } from "../types/api";

const AdminStoreDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<AdminStoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStore = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminStoreById(id);
      setStore(data);
    } catch {
      setError("Failed to load store details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, [id]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/stores"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Manage Stores
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Store Details</h1>
        <p className="mt-1 text-slate-500">View complete store information</p>
      </div>

      {loading && <LoadingState message="Loading store details..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadStore} />
      )}

      {!loading && !error && store && (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Store Name
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                {store.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </dt>
              <dd className="mt-1 text-base text-slate-700">{store.email}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Address
              </dt>
              <dd className="mt-1 text-base text-slate-700">{store.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Owner Name
              </dt>
              <dd className="mt-1 text-base text-slate-700">{store.owner.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Owner Email
              </dt>
              <dd className="mt-1 text-base text-slate-700">{store.owner.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Average Rating
              </dt>
              <dd className="mt-1 flex items-center gap-2">
                <StarRating rating={Number(store.averageRating)} />
                <span className="text-base font-semibold text-slate-900">
                  {store.averageRating}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStoreDetails;
