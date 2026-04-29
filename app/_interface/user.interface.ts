export interface User {
  id: string;
  username: string;
  email: string;
  role: string; // role id or role name
  status: "active" | "inactive";
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

export const PERMISSIONS = [
  "dashboard:view",
  "data:view",
  "data:create",
  "data:edit",
  "data:delete",
  "users:view",
  "users:create",
  "users:edit",
  "users:delete",
  "roles:view",
  "roles:create",
  "roles:edit",
  "roles:delete",
];
