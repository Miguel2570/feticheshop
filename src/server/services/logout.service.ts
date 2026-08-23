import { getRefreshToken } from "@/server/auth/cookies";
import { refreshTokenRepository } from "@/server/repositories/refresh-token.repository";

export class LogoutService {
  async logout() {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      const stored = await refreshTokenRepository.find(
        refreshToken
      );

      if (stored && !stored.revokedAt) {
        await refreshTokenRepository.revoke(
          refreshToken
        );
      }
    }
  }
}

export const logoutService = new LogoutService();