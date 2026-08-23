import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const JWT_SECRET = getEnv("JWT_SECRET");
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");

// Alterado de 15m para 1d
const ACCESS_TOKEN_EXPIRES_IN = "1d";

// Mantido em 30 dias
const REFRESH_TOKEN_EXPIRES_IN = "30d";

export function generateAccessToken(
  payload: JwtPayload
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function generateRefreshToken(
  payload: JwtPayload
): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyAccessToken(
  token: string
): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(
  token: string
): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}