import { PERMISSIONS } from "@/app/_interface/user.interface";

const STORAGE_KEYS = {
  USERS: "app_users",
  ROLES: "app_roles",
  CURRENT_USER: "app_current_user",
};

// Initialize with default data if empty
const initializeDefaults = () => {
  if (typeof window === "undefined") return;

  // Default roles
  const defaultRoles: any[] = [
    {
      id: "role_1",
      name: "superadmin",
      description: "Full access to all features",
      permissions: PERMISSIONS,
      createdAt: new Date().toISOString(),
    },
      {
        id: "role_2",
        name: "admin",
        description: "Administrative access (view only)",
        permissions: [
          "dashboard:view",
          "data:view",
          "users:view",
          "roles:view",
        ],
        createdAt: new Date().toISOString(),
      },
    {
      id: "role_3",
      name: "user",
      description: "Regular user access",
      permissions: ["dashboard:view", "data:view"],
      createdAt: new Date().toISOString(),
    },
  ];

  // Default users (excluding superadmin from display)
  const defaultUsers: any[] = [
    {
      id: "user_1",
      username: "johndoe",
      email: "john@example.com",
      role: "admin",
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_2",
      username: "janedoe",
      email: "jane@example.com",
      role: "user",
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_3",
      username: "bobsmith",
      email: "bob@example.com",
      role: "admin",
      status: "inactive" as const,
      createdAt: new Date().toISOString(),
    },
  ];

  if (!localStorage.getItem(STORAGE_KEYS.ROLES)) {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(defaultRoles));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
};

// Users CRUD
export const getUsers = (): any[] => {
  initializeDefaults();
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getUsersExceptSuperadmin = (): any[] => {
  const users = getUsers();
  return users.filter((u) => u.role !== "superadmin");
};

export const getUserById = (id: string): any | undefined => {
  const users = getUsers();
  return users.find((u) => u.id === id);
};

export const createUser = (user: Omit<any, "id" | "createdAt">) => {
  const users = getUsers();
  const newUser = {
    ...user,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const updateUser = (id: string, updates: Partial<any>) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
  }
  return null;
};

export const deleteUser = (id: string) => {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
};

// Roles CRUD
export const getRoles = (): any[] => {
  initializeDefaults();
  if (typeof window === "undefined") return [];
  const roles = localStorage.getItem(STORAGE_KEYS.ROLES);
  return roles ? JSON.parse(roles) : [];
};

export const getRoleById = (id: string): any | undefined => {
  const roles = getRoles();
  return roles.find((r) => r.id === id);
};

export const getRoleByName = (name: string): any | undefined => {
  const roles = getRoles();
  return roles.find((r) => r.name === name);
};

export const createRole = (role: Omit<any, "id" | "createdAt">) => {
  const roles = getRoles();
  const newRole = {
    ...role,
    id: `role_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  roles.push(newRole);
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  return newRole;
};

export const updateRole = (id: string, updates: Partial<any>) => {
  const roles = getRoles();
  const index = roles.findIndex((r) => r.id === id);
  if (index !== -1) {
    roles[index] = { ...roles[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    return roles[index];
  }
  return null;
};

export const deleteRole = (id: string) => {
  const roles = getRoles();
  const filtered = roles.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(filtered));
};

export { STORAGE_KEYS, initializeDefaults, PERMISSIONS };
export type { Role, User } from "@/app/_interface/user.interface";
