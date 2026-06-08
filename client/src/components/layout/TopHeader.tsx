import { BellIcon, ChevronDownIcon, MenuIcon, SearchIcon } from "../icons";

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
  onMenuClick?: () => void;
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
  onMenuClick,
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

  const showHeaderSearch = showSearch && !headerSearchUnavailable;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 lg:h-16 lg:gap-6 lg:px-8 lg:py-0">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}

          {title ? (
            <div className="min-w-0 flex-1 lg:hidden">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-xs text-slate-500 sm:text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            showHeaderSearch && (
              <form
                onSubmit={handleSubmit}
                className="relative hidden min-w-0 flex-1 md:block"
              >
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => onSearchChange?.(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </form>
            )
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {title && showHeaderSearch && (
            <form
              onSubmit={handleSubmit}
              className="relative hidden w-48 lg:block"
            >
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

          <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:gap-3 sm:pl-3">
            <div className="hidden text-right md:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900 lg:max-w-none">
                {profileName}
              </p>
              <p className="max-w-[140px] truncate text-xs text-slate-500 lg:max-w-none">
                {profileRole || profileEmail}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
              {initials}
            </div>
            <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 md:block" />
          </div>
        </div>
      </div>

      {!title && showHeaderSearch && (
        <form onSubmit={handleSubmit} className="border-t border-slate-100 px-4 py-3 md:hidden">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </form>
      )}

      {title && showHeaderSearch && (
        <form onSubmit={handleSubmit} className="border-t border-slate-100 px-4 py-3 lg:hidden">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search stores..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </form>
      )}
    </header>
  );
};

export default TopHeader;
