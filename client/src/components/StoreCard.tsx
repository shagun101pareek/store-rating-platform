import type { StoreListing } from "../types/api";
import StarRating from "./ui/StarRating";
import StoreImage from "./ui/StoreImage";
import {
  ArrowRightIcon,
  ChevronRightSmallIcon,
  DotsVerticalIcon,
  LocationIcon,
} from "./icons";

type Props = {
  store: StoreListing;
  onRate: (store: StoreListing) => void;
};

const StoreCard = ({ store, onRate }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 overflow-hidden">
        <StoreImage
          storeName={store.name}
          ownerName={store.ownerName}
          imageUrl={store.imageUrl}
        />
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900">{store.name}</h3>
          <button
            type="button"
            className="shrink-0 text-slate-300 hover:text-slate-500"
            aria-label="Options"
          >
            <DotsVerticalIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-1.5 text-sm text-slate-500">
          <LocationIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{store.address}</span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Global Rating
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating rating={Number(store.averageRating)} size="sm" />
              <span className="text-sm font-bold text-slate-900">
                {store.averageRating}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Your Rating
            </p>
            <div className="mt-1.5">
              {store.hasRated && store.userRating !== null ? (
                <span className="text-sm font-bold text-blue-600">
                  {store.userRating} ★
                </span>
              ) : (
                <span className="text-sm italic text-slate-400">No rating</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRate(store)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            store.hasRated
              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {store.hasRated ? "Update Rating" : "Rate Now"}
          {store.hasRated ? (
            <ChevronRightSmallIcon className="h-4 w-4" />
          ) : (
            <ArrowRightIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
