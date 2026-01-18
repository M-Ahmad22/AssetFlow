// import { useAuth } from '@/context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { LogOut, User } from 'lucide-react';

// interface HeaderProps {
//   title: string;
//   description?: string;
// }

// export function Header({ title, description }: HeaderProps) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const getRoleBadgeClass = (role: string) => {
//     switch (role) {
//       case 'Admin':
//         return 'role-badge role-admin';
//       case 'Manager':
//         return 'role-badge role-manager';
//       case 'Viewer':
//         return 'role-badge role-viewer';
//       default:
//         return 'role-badge';
//     }
//   };

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
//       <div className="page-header mb-0">
//         <h1 className="text-xl font-semibold text-foreground">{title}</h1>
//         {description && (
//           <p className="text-sm text-muted-foreground">{description}</p>
//         )}
//       </div>

//       {user && (
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
//               <User className="h-4 w-4 text-muted-foreground" />
//             </div>
//             <div className="hidden sm:block">
//               <p className="text-sm font-medium text-foreground">{user.name}</p>
//               <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="btn-ghost gap-2 text-muted-foreground hover:text-foreground"
//           >
//             <LogOut className="h-4 w-4" />
//             <span className="hidden sm:inline">Logout</span>
//           </button>
//         </div>
//       )}
//     </header>
//   );
// }

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="px-3">
          <h1 className="text-sm lg:text-xl font-semibold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-xs lg:text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-ghost gap-2 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}
