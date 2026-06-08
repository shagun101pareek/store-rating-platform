import { useEffect, useState } from "react";
import type { StoreListing } from "../types/api";

type Props = {
  store: StoreListing | null;
  onClose: () => void;
  onSubmit: (storeId: string, rating: number, isUpdate: boolean) => Promise<void>;
};

const RatingModal = ({ store, onClose, onSubmit }: Props) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isUpdate = store?.hasRated ?? false;
  const existingRating = store?.userRating ?? null;

  useEffect(() => {
    if (store) {
      setRating(existingRating ?? 0);
      setError("");
    }
  }, [store, existingRating]);

  if (!store) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(store.id, rating, isUpdate);
      onClose();
    } catch {
      setError("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isUpdate ? "Update Rating" : "Rate Store"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{store.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-sm font-medium text-slate-700">Select your rating</p>
          <div className="mb-6 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`rounded-lg p-2 transition ${
                  rating >= value ? "text-amber-400" : "text-slate-300 hover:text-amber-300"
                }`}
              >
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : isUpdate ? "Update" : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
