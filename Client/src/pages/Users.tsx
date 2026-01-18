import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { User, UserRole, UserStatus } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Pencil,
  Trash2,
  Users as UsersIcon,
  Shield,
  Settings,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

/* ===============================
   TYPES
================================ */
interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

const initialFormData: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: "Viewer",
  status: "Active",
};

/* ===============================
   COMPONENT
================================ */
export default function Users() {
  const {
    user: currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    changeUserRole,
    toggleUserStatus,
  } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});

  /* ===============================
     UI HELPERS
  ================================ */
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4" />;
      case "Manager":
        return <Settings className="h-4 w-4" />;
      case "Viewer":
        return <Eye className="h-4 w-4" />;
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "bg-destructive/10 text-destructive";
      case "Manager":
        return "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]";
      case "Viewer":
        return "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]";
    }
  };

  const getStatusBadgeClass = (status: UserStatus) =>
    status === "Active"
      ? "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]"
      : "bg-muted text-muted-foreground";

  /* ===============================
     VALIDATION
  ================================ */
  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    } else {
      const exists = users.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.id !== editingUser?.id
      );
      if (exists) errors.email = "Email already exists";
    }

    if (!editingUser && !formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ===============================
     DIALOG HANDLERS
  ================================ */
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData(initialFormData);
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  /* ===============================
     CREATE / UPDATE
  ================================ */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (editingUser) {
      if (
        currentUser?.id === editingUser.id &&
        editingUser.role === "Admin" &&
        formData.role !== "Admin"
      ) {
        toast.error("You cannot change your own role from Admin");
        return;
      }

      const success = await updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        ...(formData.password && { password: formData.password }),
      });

      success
        ? toast.success("User updated successfully")
        : toast.error("Error while updating user");
    } else {
      const success = await addUser(formData);

      success
        ? toast.success("User created successfully")
        : toast.error("Error while creating user");
    }

    handleCloseDialog();
  };

  /* ===============================
     DELETE
  ================================ */
  const handleDelete = async () => {
    if (!userToDelete) return;

    const success = await deleteUser(userToDelete.id);

    success
      ? toast.success("User deleted successfully")
      : toast.error("Cannot delete your own account");

    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  /* ===============================
     ROLE / STATUS
  ================================ */
  const handleRoleChange = async (id: string, role: UserRole) => {
    const success = await changeUserRole(id, role);
    success
      ? toast.success("User role updated successfully")
      : toast.error("Error while updating role");
  };

  const handleToggleStatus = async (user: User) => {
    const success = await toggleUserStatus(user.id);
    success
      ? toast.success(
          `User ${
            user.status === "Active" ? "disabled" : "enabled"
          } successfully`
        )
      : toast.error("Error while updating status");
  };

  const isCurrentUser = (id: string) => currentUser?.id === id;

  /* ===============================
     RENDER
  ================================ */
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">User Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Table */}
        <div className="enterprise-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {isCurrentUser(user.id) && (
                          <span className="text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(v) =>
                        handleRoleChange(user.id, v as UserRole)
                      }
                      disabled={isCurrentUser(user.id) && user.role === "Admin"}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status === "Active"}
                        onCheckedChange={() => handleToggleStatus(user)}
                        disabled={isCurrentUser(user.id)}
                      />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusBadgeClass(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isCurrentUser(user.id)}
                      className="text-destructive"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user details below."
                : "Fill in the details for the new user."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {formErrors.password && (
                <p className="text-xs text-destructive">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({ ...formData, role: v as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v as UserStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{userToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
