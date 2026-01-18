import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileBarChart,
  Users,
  Box,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Assets", href: "/assets", icon: Package },
  {
    name: "Categories",
    href: "/categories",
    icon: FolderTree,
    permission: "canManageCategories" as const,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    permission: "canManageUsers" as const,
  },
  { name: "Reports", href: "/reports", icon: FileBarChart },
];

export function Sidebar() {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter((item) => {
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Box className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground">
              AssetFlow
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              Inventory System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {user && (
          <div className="border-t border-sidebar-border p-4 ">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-accent truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-accent/60">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
