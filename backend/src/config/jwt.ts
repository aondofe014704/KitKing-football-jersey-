export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_change_in_production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_change_in_production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
