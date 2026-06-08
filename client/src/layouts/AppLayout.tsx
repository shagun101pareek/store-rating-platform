import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar, { type NavItem } from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import {
  ChartIcon,
  CompassIcon,
  DashboardIcon,
  HomeIcon,
  MyRatingsIcon,
  ProfileIcon,
  RatingsStarIcon,
  ReviewsIcon,
  SettingsIcon,
  StoreIcon,
  UsersIcon,
} from "../components/icons";

type Props = {
  children: ReactNode;
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null") as {
      name?: string;
      email?: string;
      role?: string;
    } | null;
  } catch {
    return null;
  }
};

type AppShellProps = {
  brandName: string;
  items: NavItem[];
  headerProps: React.ComponentProps<typeof TopHeader>;
  children: ReactNode;
  footer?: ReactNode;
};

const AppShell = ({
  brandName,
  items,
  headerProps,
  children,
  footer,
}: AppShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <Sidebar
        brandName={brandName}
        items={items}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen w-full min-w-0 flex-col lg:pl-64">
        <TopHeader
          {...headerProps}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="w-full min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        {footer}
      </div>
    </div>
  );
};

export const AdminLayout = ({ children }: Props) => {
  const location = useLocation();
  const user = getStoredUser();

  const items: NavItem[] = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <DashboardIcon className="h-5 w-5" />,
      active: location.pathname === "/admin",
    },
    {
      label: "Manage Stores",
      path: "/admin/stores",
      icon: <StoreIcon className="h-5 w-5" />,
      active:
        location.pathname === "/admin/stores" ||
        location.pathname.startsWith("/admin/stores/"),
    },
    {
      label: "User Directory",
      path: "/admin/users",
      icon: <UsersIcon className="h-5 w-5" />,
      active:
        location.pathname === "/admin/users" ||
        location.pathname.startsWith("/admin/users/"),
    },
    {
      label: "Global Ratings",
      path: "/admin/ratings",
      icon: <RatingsStarIcon className="h-5 w-5" />,
      active: location.pathname === "/admin/ratings",
    },
    {
      label: "Change Password",
      path: "/change-password",
      icon: <SettingsIcon className="h-5 w-5" />,
      active: location.pathname === "/change-password",
    },
  ];

  return (
    <AppShell
      brandName="StoreRate"
      items={items}
      headerProps={{
        profileName: user?.name || "Admin",
        profileEmail: user?.email || "",
        showSearch: false,
      }}
    >
      {children}
    </AppShell>
  );
};

export const OwnerLayout = ({
  children,
  storeName,
}: Props & { storeName?: string | null }) => {
  const location = useLocation();
  const user = getStoredUser();

  const items: NavItem[] = [
    {
      label: "Store Analytics",
      path: "/owner",
      icon: <ChartIcon className="h-5 w-5" />,
      active: location.pathname === "/owner",
    },
    {
      label: "Store Profile",
      path: "/owner/profile",
      icon: <StoreIcon className="h-5 w-5" />,
      active: location.pathname === "/owner/profile",
    },
    {
      label: "Customer Reviews",
      path: "/owner/reviews",
      icon: <ReviewsIcon className="h-5 w-5" />,
      active: location.pathname === "/owner/reviews",
    },
    {
      label: "Change Password",
      path: "/change-password",
      icon: <SettingsIcon className="h-5 w-5" />,
      active: location.pathname === "/change-password",
    },
  ];

  return (
    <AppShell
      brandName="StoreRate"
      items={items}
      headerProps={{
        profileName: storeName ?? user?.name ?? "Store Owner",
        profileEmail: user?.email || "",
        showSearch: false,
      }}
    >
      {children}
    </AppShell>
  );
};

type UserLayoutProps = Props & {
  title?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  showSearch?: boolean;
};

export const UserLayout = ({
  children,
  title = "Explore Stores",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
}: UserLayoutProps) => {
  const location = useLocation();
  const user = getStoredUser();

  const items: NavItem[] = [
    {
      label: "Home",
      path: "/home",
      icon: <HomeIcon className="h-5 w-5" />,
      active: location.pathname === "/home",
    },
    {
      label: "Explore Stores",
      path: "/stores",
      icon: <CompassIcon className="h-5 w-5" />,
      active: location.pathname === "/stores",
    },
    {
      label: "My Ratings",
      path: "/my-ratings",
      icon: <MyRatingsIcon className="h-5 w-5" />,
      active: location.pathname === "/my-ratings",
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <ProfileIcon className="h-5 w-5" />,
      active: location.pathname === "/profile",
    },
  ];

  return (
    <AppShell
      brandName="RateIt"
      items={items}
      headerProps={{
        title,
        profileName: user?.name || "User",
        profileRole: user?.role || "CUSTOMER",
        searchValue,
        onSearchChange,
        onSearchSubmit,
        showSearch,
      }}
      footer={
        <footer className="border-t border-slate-200 px-4 py-4 md:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
            <div className="flex gap-6 uppercase tracking-wide" />
          </div>
        </footer>
      }
    >
      {children}
    </AppShell>
  );
};

export const getStoredUserProfile = getStoredUser;
