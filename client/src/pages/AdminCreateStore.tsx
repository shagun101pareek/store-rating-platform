import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminLayout } from "../layouts/AppLayout";
import LoadingState from "../components/ui/LoadingState";
import StoreImage from "../components/ui/StoreImage";
import {
  createAdminStore,
  fetchAdminUsers,
} from "../services/adminService";
import {
  formatServerErrors,
  getFieldErrors,
  validateAddress,
  validateEmail,
  validateName,
  type ServerValidationError,
} from "../utils/validation";
import { readImageAsDataUrl } from "../utils/storeImage";
import type { AdminUser } from "../types/api";

const AdminCreateStore = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState("");
  const [owners, setOwners] = useState<AdminUser[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const users = await fetchAdminUsers({ role: "STORE_OWNER" });
        setOwners(users);
        if (users.length > 0) {
          setOwnerId(users[0].id);
        }
      } catch {
        setError("Failed to load store owners.");
      } finally {
        setLoadingOwners(false);
      }
    };

    loadOwners();
  }, []);

  const selectedOwner = owners.find((owner) => owner.id === ownerId);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setImageUrl(dataUrl);
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load image.");
    } finally {
      event.target.value = "";
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const nameError = validateName(name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const addressError = validateAddress(address);
    if (addressError) errors.address = addressError;

    if (!ownerId) {
      errors.ownerId = "Store owner is required.";
    }

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
      await createAdminStore({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        ownerId,
        imageUrl,
      });
      navigate("/admin/stores");
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
            err.response?.data?.message || "Failed to create store."
          );
        }
      } else {
        setError("Failed to create store.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingOwners) {
    return (
      <AdminLayout>
        <LoadingState message="Loading store owners..." />
      </AdminLayout>
    );
  }

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
        <h1 className="text-2xl font-bold text-slate-900">Register Store</h1>
        <p className="mt-1 text-slate-500">Add a new store to the platform</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {owners.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-800">
          No store owners available.{" "}
          <Link to="/admin/users/new" className="font-semibold underline">
            Create a store owner first
          </Link>
          .
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-5 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
        >
          <div>
            <p className="mb-3 text-sm font-medium text-slate-700">
              Store Image (optional)
            </p>
            <div className="mb-5 flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200">
                <StoreImage
                  storeName={name || "Store"}
                  ownerName={selectedOwner?.name}
                  imageUrl={imageUrl}
                  size="profile"
                />
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Upload Image
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="ml-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <FormField
            id="name"
            label="Store Name"
            value={name}
            onChange={setName}
            error={fieldErrors.name}
            placeholder="20–60 characters"
          />
          <FormField
            id="email"
            label="Store Email"
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

          <div>
            <label
              htmlFor="ownerId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Store Owner
            </label>
            <select
              id="ownerId"
              value={ownerId}
              onChange={(event) => setOwnerId(event.target.value)}
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white ${
                fieldErrors.ownerId
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
            >
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {fieldErrors.ownerId && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.ownerId}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register Store"}
          </button>
        </form>
      )}
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

export default AdminCreateStore;
