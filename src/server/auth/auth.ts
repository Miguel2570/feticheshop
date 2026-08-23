import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AuthPayload {
  userId: string;
  role: string;
}

export async function verifyAccessToken(
  token: string
): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, secret);

  return {
    userId: payload.userId as string,
    role: payload.role as string,
  };
}