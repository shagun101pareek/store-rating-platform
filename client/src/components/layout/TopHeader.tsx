import { BellIcon, ChevronDownIcon, SearchIcon } from "../icons";

type Props = {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  showSearch?: boolean;
  profileName?: string;
  profileEmail?: string;
  profileRole?: string;
  headerSearchUnavailable?: boolean;
};

const TopHeader = ({
  title,
  subtitle,
  searchPlaceholder = "Search resources, stores, or help...",
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
  profileName = "User",
  profileEmail = "",
  profileRole,
  headerSearchUnavailable = false,
}: Props) => {
  const initials = profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearchSubmit?.();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-6 px-8">
        {title ? (
          <div className="min-w-0 shrink-0">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="truncate text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        ) : (
          showSearch && (
            <form onSubmit={handleSubmit} className="relative max-w-xl flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                disabled={headerSearchUnavailable}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </form>
          )
        )}

        <div className="flex shrink-0 items-center gap-4">
          {title && showSearch && (
            <form onSubmit={handleSubmit} className="relative hidden w-48 lg:block">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder="Search stores..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </form>
          )}

          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{profileName}</p>
              <p className="text-xs text-slate-500">
                {profileRole || profileEmail}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
