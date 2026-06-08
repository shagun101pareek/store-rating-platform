import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminLayout,
  OwnerLayout,
  UserLayout,
  getStoredUserProfile,
} from "../layouts/AppLayout";
import { changePassword } from "../services/authService";
import axios from "axios";
import { validatePassword } from "../utils/validation";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const user = getStoredUserProfile();

  const validate = (): string | null => {
    if (!currentPassword) {
      return "Current password is required.";
    }
    if (!newPassword) {
      return "New password is required.";
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return passwordError;
    }
    if (newPassword !== confirmPassword) {
      return "New password and confirm password do not match.";
    }
    if (currentPassword === newPassword) {
      return "New password must be different from current password.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        if (user?.role === "ADMIN") {
          navigate("/admin");
        } else if (user?.role === "STORE_OWNER") {
          navigate("/owner");
        } else {
          navigate("/home");
        }
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to update password."
        );
      } else {
        setError("Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <div className="mx-auto max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
        <p className="mt-1 text-slate-500">
          Update your account password
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );

  if (user?.role === "ADMIN") {
    return <AdminLayout>{form}</AdminLayout>;
  }

  if (user?.role === "STORE_OWNER") {
    return <OwnerLayout>{form}</OwnerLayout>;
  }

  return (
    <UserLayout title="Change Password" showSearch={false}>
      {form}
    </UserLayout>
  );
};

export default ChangePassword;
