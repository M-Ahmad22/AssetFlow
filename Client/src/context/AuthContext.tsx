import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { User, UserRole, rolePermissions } from "@/data/users";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  user: User | null;
  users: User[];
  token: string | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => void;
  hasPermission: (permission: keyof typeof rolePermissions.Admin) => boolean;

  addUser: (userData: Omit<User, "id">) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  changeUserRole: (id: string, role: UserRole) => Promise<boolean>;
  toggleUserStatus: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
        ? data.users
        : [];

      setUsers(
        list.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          avatar: u.avatar,
        }))
      );
    } catch {}
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "Login failed" };
      }

      setUser({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
      });

      setToken(data.token);
      localStorage.setItem("token", data.token);

      return { success: true };
    } catch {
      return { success: false, error: "Server unreachable" };
    }
  }, []);

  const logout = () => {
    setUser(null);
    setUsers([]);
    setToken(null);
    localStorage.removeItem("token");
  };

  const hasPermission = useCallback(
    (permission: keyof typeof rolePermissions.Admin) => {
      if (!user) return false;
      return rolePermissions[user.role][permission];
    },
    [user]
  );

  const addUser = async (userData: Omit<User, "id">) => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) return false;
      await fetchUsers();
      return true;
    } catch {
      return false;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) return false;
      await fetchUsers();
      return true;
    } catch {
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    if (user?.id === id) return false;

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return false;
      await fetchUsers();
      return true;
    } catch {
      return false;
    }
  };

  const changeUserRole = async (id: string, role: UserRole) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) return false;
      await fetchUsers();
      return true;
    } catch {
      return false;
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return false;
      await fetchUsers();
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
        addUser,
        updateUser,
        deleteUser,
        changeUserRole,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
