import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutIcon, StarLogo } from "../icons";

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
};

const Sidebar = ({ brandName, items }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <StarLogo className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold text-slate-900">{brandName}</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const isActive = item.active;
          const isDisabled = item.disabled || !item.path;

          return (
            <button
              key={item.label}
              type="button"
              disabled={isDisabled}
              onClick={() => item.path && navigate(item.path)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : isDisabled
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={isActive ? "text-blue-600" : isDisabled ? "text-slate-300" : "text-slate-400"}>
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

      <div className="border-t border-slate-100 p-4">
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
  );
};

export default Sidebar;
