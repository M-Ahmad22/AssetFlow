export type UserRole = "Admin" | "Manager" | "Viewer";
export type UserStatus = "Active" | "Disabled";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
}

// export const users: User[] = [
//   {
//     id: '1',
//     name: 'Sarah Johnson',
//     email: 'sarah.johnson@company.com',
//     password: 'admin123',
//     role: 'Admin',
//     status: 'Active',
//   },
//   {
//     id: '2',
//     name: 'Michael Chen',
//     email: 'michael.chen@company.com',
//     password: 'manager123',
//     role: 'Manager',
//     status: 'Active',
//   },
//   {
//     id: '3',
//     name: 'Emily Davis',
//     email: 'emily.davis@company.com',
//     password: 'viewer123',
//     role: 'Viewer',
//     status: 'Active',
//   },
// ];

export const rolePermissions = {
  Admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageCategories: true,
    canManageUsers: true,
    canUpdateStatus: true,
    canUpdateLocation: true,
    canViewReports: true,
  },
  Manager: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManageCategories: false,
    canManageUsers: false,
    canUpdateStatus: true,
    canUpdateLocation: true,
    canViewReports: true,
  },
  Viewer: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManageCategories: false,
    canManageUsers: false,
    canUpdateStatus: false,
    canUpdateLocation: false,
    canViewReports: true,
  },
};
