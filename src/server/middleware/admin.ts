import { requireAuth } from "./auth";

export async function requireAdmin() {
  const user = await requireAuth();

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN"
  ) {
    throw new Error("Forbidden");
  }

  return user;
}