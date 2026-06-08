import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminLayout } from "../layouts/AppLayout";
import { createAdminUser } from "../services/adminService";
import {
  formatServerErrors,
  getFieldErrors,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
  type ServerValidationError,
} from "../utils/validation";
import type { Role } from "../types/api";

const ROLES: { value: Role; label: string }[] = [
  { value: "USER", label: "User" },
  { value: "STORE_OWNER", label: "Store Owner" },
  { value: "ADMIN", label: "Admin" },
];

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const nameError = validateName(name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const addressError = validateAddress(address);
    if (addressError) errors.address = addressError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      await createAdminUser({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        password,
        role,
      });
      navigate("/admin/users");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverErrors = err.response?.data?.errors as
          | ServerValidationError[]
          | undefined;
        if (serverErrors?.length) {
          setFieldErrors(getFieldErrors(serverErrors));
          setError(formatServerErrors(serverErrors));
        } else {
          setError(
            err.response?.data?.message || "Failed to create user."
          );
        }
      } else {
        setError("Failed to create user.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Create User</h1>
        <p className="mt-1 text-slate-500">Register a new platform user</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-5 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        <FormField
          id="name"
          label="Full Name"
          value={name}
          onChange={setName}
          error={fieldErrors.name}
          placeholder="20–60 characters"
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
        />
        <FormField
          id="address"
          label="Address"
          value={address}
          onChange={setAddress}
          error={fieldErrors.address}
          placeholder="Max 400 characters"
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          placeholder="8–16 chars, uppercase + special"
        />

        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
          >
            {ROLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </AdminLayout>
  );
};

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
};

const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white ${
        error
          ? "border-red-300 focus:border-red-500"
          : "border-slate-200 focus:border-blue-500"
      }`}
      required
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default AdminCreateUser;
