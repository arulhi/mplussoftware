import { getRoleByName, User, Role } from "./localStorage";

// Get current logged-in user from localStorage (simulated)
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("app_current_user");
  if (userStr) return JSON.parse(userStr);

  // Default to emilys as superadmin
  const defaultUser: User = {
    id: "user_superadmin",
    username: "emilys",
    email: "emilys@example.com",
    role: "superadmin",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem("app_current_user", JSON.stringify(defaultUser));
  return defaultUser;
};

// Check if user has specific permission
export const hasPermission = (
  user: User | null,
  permission: string
): boolean => {
  if (!user) return false;
  if (user.role === "superadmin") return true; // Superadmin has all permissions

  const role = getRoleByName(user.role);
  if (!role) return false;

  return role.permissions.includes(permission);
};

// Check if user has any of the given permissions
export const hasAnyPermission = (
  user: User | null,
  permissions: string[]
): boolean => {
  return permissions.some((p) => hasPermission(user, p));
};

// Get user's role details
export const getUserRole = (user: User | null): Role | undefined => {
  if (!user) return undefined;
  return getRoleByName(user.role);
};

// Role-based component wrapper
export const can = (
  user: User | null,
  permission: string,
  component: any,
  fallback: any = null
) => {
  if (hasPermission(user, permission)) {
    return component;
  }
  return fallback;
};
