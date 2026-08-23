import { Role } from "@prisma/client";

export const permissions = {
  SUPER_ADMIN: [
    "*",
  ],

  ADMIN: [
    "dashboard",
    "products",
    "categories",
    "brands",
    "attributes",
    "orders",
    "customers",
    "inventory",
    "suppliers",
    "coupons",
    "newsletter",
    "banners",
    "settings",
  ],

  MANAGER: [
    "dashboard",
    "products",
    "categories",
    "brands",
    "attributes",
    "orders",
    "customers",
    "inventory",
  ],

  CUSTOMER: [
    "account",
    "wishlist",
    "orders",
  ],
};

export function hasPermission(
  role: Role,
  permission: string,
) {
  if (role === "SUPER_ADMIN") {
    return true;
  }

  return permissions[role].includes(permission);
}

export function isAdmin(role: Role) {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN"
  );
}

export function isManager(role: Role) {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "MANAGER"
  );
}