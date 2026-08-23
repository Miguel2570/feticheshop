import { Role } from "@prisma/client";

export function hasRole(
  userRole: Role,
  allowedRoles: Role[]
): boolean {
  return allowedRoles.includes(userRole);
}