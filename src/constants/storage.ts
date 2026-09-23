export const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    EXPIRES_AT: "token_expires_at",
    USER: "auth_user",
    ROLES: "auth_roles",
} as const;

export const AUTH_STORAGE = {
    ACCESS_TOKEN: STORAGE_KEYS.ACCESS_TOKEN,
    REFRESH_TOKEN: STORAGE_KEYS.REFRESH_TOKEN,
    EXPIRES_AT: STORAGE_KEYS.EXPIRES_AT,
    USER: STORAGE_KEYS.USER,
    ROLES: STORAGE_KEYS.ROLES,
} as const;
