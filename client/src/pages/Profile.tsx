import { Link } from "react-router-dom";
import { UserLayout, getStoredUserProfile } from "../layouts/AppLayout";

const roleLabel = (role?: string) => {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "STORE_OWNER":
      return "Store Owner";
    case "USER":
      return "User";
    default:
      return role || "User";
  }
};

const Profile = () => {
  const user = getStoredUserProfile() as {
    name?: string;
    email?: string;
    address?: string;
    role?: string;
  } | null;

  return (
    <UserLayout title="Profile" showSearch={false}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-500">Your account information</p>
      </div>

      <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <dl className="space-y-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Name
            </dt>
            <dd className="mt-1 text-base font-semibold text-slate-900">
              {user?.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </dt>
            <dd className="mt-1 text-base text-slate-700">
              {user?.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Address
            </dt>
            <dd className="mt-1 text-base text-slate-700">
              {user?.address || (
                <span className="text-slate-400">
                  Not available in your session. Address is stored on your
                  account but not returned by the login API.
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Role
            </dt>
            <dd className="mt-1">
              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                {roleLabel(user?.role)}
              </span>
            </dd>
          </div>
        </dl>

        <Link
          to="/change-password"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Change Password
        </Link>
      </div>
    </UserLayout>
  );
};

export default Profile;
