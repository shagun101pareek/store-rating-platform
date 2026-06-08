import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon, LogoutIcon, StarLogo } from "../icons";

export type NavItem = {
  label: string;
  path?: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
};

type Props = {
  brandName: string;
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ brandName, items, isOpen, onClose }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavClick = (path?: string) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-xl lg:z-30 lg:w-64 lg:shadow-none ${
          isOpen ? "flex" : "hidden"
        } lg:flex`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <StarLogo className="h-4 w-4" />
            </div>
            <span className="truncate text-lg font-bold text-slate-900">
              {brandName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const isActive = item.active;
            const isDisabled = item.disabled || !item.path;

            return (
              <button
                key={item.label}
                type="button"
                disabled={isDisabled}
                onClick={() => handleNavClick(item.path)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : isDisabled
                      ? "cursor-not-allowed text-slate-300"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-blue-600"
                      : isDisabled
                        ? "text-slate-300"
                        : "text-slate-400"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="absolute right-3 h-2 w-2 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <LogoutIcon className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
