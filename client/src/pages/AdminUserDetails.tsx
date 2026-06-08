import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminLayout } from "../layouts/AppLayout";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import StarRating from "../components/ui/StarRating";
import { fetchAdminUserById } from "../services/adminService";
import type { AdminUser } from "../types/api";

const roleBadgeClass = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-50 text-purple-700 ring-1 ring-purple-100";
    case "STORE_OWNER":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    default:
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AdminUserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminUserById(id);
      setUser(data);
    } catch {
      setError("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to User Directory
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">User Details</h1>
        <p className="mt-1 text-slate-500">View complete user information</p>
      </div>

      {loading && <LoadingState message="Loading user details..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadUser} />
      )}

      {!loading && !error && user && (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                {user.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </dt>
              <dd className="mt-1 text-base text-slate-700">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Address
              </dt>
              <dd className="mt-1 text-base text-slate-700">{user.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Role
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(user.role)}`}
                >
                  {user.role}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created Date
              </dt>
              <dd className="mt-1 text-base text-slate-700">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            {user.role === "STORE_OWNER" && user.ownedStore && (
              <>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Owned Store
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-slate-900">
                    {user.ownedStore.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Store Rating
                  </dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <StarRating
                      rating={Number(user.ownedStore.averageRating)}
                      size="sm"
                    />
                    <span className="text-base font-semibold text-slate-900">
                      {user.ownedStore.averageRating}
                    </span>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUserDetails;
