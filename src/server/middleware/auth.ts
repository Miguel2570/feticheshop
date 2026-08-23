import { verifyAccessToken } from "@/server/auth/jwt";
import { getAccessToken } from "@/server/auth/cookies";

export async function requireAuth() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyAccessToken(token);
}