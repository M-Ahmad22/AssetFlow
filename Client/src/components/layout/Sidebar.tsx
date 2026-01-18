// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import {
//   LayoutDashboard,
//   Package,
//   FolderTree,
//   FileBarChart,
//   Users,
//   Box,
//   MapPin,
// } from "lucide-react";

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Assets", href: "/assets", icon: Package },
//   {
//     name: "Categories",
//     href: "/categories",
//     icon: FolderTree,
//     permission: "canManageCategories" as const,
//   },
//   {
//     name: "Users",
//     href: "/users",
//     icon: Users,
//     permission: "canManageUsers" as const,
//   },
//   { name: "Reports", href: "/reports", icon: FileBarChart },
//   {
//     name: "Locations",
//     href: "/locations",
//     icon: MapPin,
//   },
// ];

// export function Sidebar() {
//   const location = useLocation();
//   const { user, hasPermission } = useAuth();

//   const filteredNavigation = navigation.filter((item) => {
//     if (item.permission) {
//       return hasPermission(item.permission);
//     }
//     return true;
//   });

//   return (
//     <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar-background">
//       <div className="flex h-full flex-col">
//         {/* Logo */}
//         <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
//             <Box className="h-5 w-5 text-sidebar-primary-foreground" />
//           </div>
//           <div>
//             <h1 className="text-base font-semibold text-sidebar-accent">
//               AssetFlow
//             </h1>
//             <p className="text-xs text-sidebar-accent/60">Inventory System</p>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-1 px-3 py-4">
//           {filteredNavigation.map((item) => {
//             const isActive = location.pathname.startsWith(item.href);
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`sidebar-nav-item ${isActive ? "active" : ""}`}
//               >
//                 <item.icon className="h-5 w-5" />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User Section */}
//         {user && (
//           <div className="border-t border-sidebar-border p-4 ">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
//                 {user.name.charAt(0)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-sidebar-accent truncate">
//                   {user.name}
//                 </p>
//                 <p className="text-xs text-sidebar-accent/60">{user.role}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileBarChart,
  Users,
  Box,
  MapPin,
  X,
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
  { name: "Locations", href: "/locations", icon: MapPin },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter((item) =>
    item.permission ? hasPermission(item.permission) : true
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Dark background behind sidebar (matches sidebar width) */}
          <div
            className="absolute left-0 top-0 h-full w-64
                 bg-background"
          />

          {/* Blurred clickable backdrop */}
          <div
            className="absolute left-64 top-0 h-full w-[calc(100%-16rem)]
                 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
        </div>
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar-background transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:z-40`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <Box className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-sidebar-accent">
                  AssetFlow
                </h1>
                <p className="text-xs text-sidebar-accent/60">
                  Inventory System
                </p>
              </div>
            </div>

            <button onClick={onClose} className="lg:hidden text-sidebar-accent">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="border-t border-sidebar-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-sidebar-accent">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-accent/60">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
