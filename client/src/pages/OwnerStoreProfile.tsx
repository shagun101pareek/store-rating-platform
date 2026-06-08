import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { OwnerLayout } from "../layouts/AppLayout";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import StoreImage from "../components/ui/StoreImage";
import {
  fetchOwnerStore,
  updateOwnerStore,
} from "../services/ownerService";
import {
  formatServerErrors,
  getFieldErrors,
  validateAddress,
  validateName,
  type ServerValidationError,
} from "../utils/validation";
import { readImageAsDataUrl } from "../utils/storeImage";
import type { OwnerStoreData } from "../types/api";

const OwnerStoreProfile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [store, setStore] = useState<OwnerStoreData | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadStore = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchOwnerStore();
      setStore(data);
      setName(data.name);
      setAddress(data.address);
      setImageUrl(data.imageUrl);
    } catch {
      setError("Failed to load store profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setImageUrl(dataUrl);
      setSuccess("");
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;
    const addressError = validateAddress(address);
    if (addressError) errors.address = addressError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }

    setSaving(true);

    try {
      const updated = await updateOwnerStore({
        name: name.trim(),
        address: address.trim(),
        imageUrl,
      });
      setStore(updated);
      setSuccess("Store profile updated successfully.");
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
            err.response?.data?.message || "Failed to update store profile."
          );
        }
      } else {
        setError("Failed to update store profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <OwnerLayout storeName={store?.name}>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Store Profile</h1>
        <p className="mt-1 text-slate-500">
          Update your store image and details shown to customers
        </p>
      </div>

      {loading && <LoadingState message="Loading store profile..." />}

      {!loading && error && !store && (
        <ErrorState message={error} onRetry={loadStore} />
      )}

      {!loading && store && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
        >
          {error && store && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div>
            <p className="mb-3 text-sm font-medium text-slate-700">
              Store Image
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-28 w-28 overflow-hidden rounded-2xl border border-slate-200">
                <StoreImage
                  storeName={name || store.name}
                  ownerName={store.ownerName}
                  imageUrl={imageUrl}
                  size="profile"
                />
              </div>
              <div className="space-y-2">
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
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Upload Image
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="ml-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Remove Image
                  </button>
                )}
                <p className="text-xs text-slate-400">
                  Images are resized automatically. Without an upload, owner
                  initials are shown on store cards.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="storeName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Store Name
            </label>
            <input
              id="storeName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white ${
                fieldErrors.name
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="storeAddress"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <input
              id="storeAddress"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white ${
                fieldErrors.address
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
              required
            />
            {fieldErrors.address && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}
    </OwnerLayout>
  );
};

export default OwnerStoreProfile;
