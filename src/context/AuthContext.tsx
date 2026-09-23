import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

import type { AuthSession, AuthUser, LoginResponse } from "../types/auth";
import type { AuthContextType, AuthProviderProps } from "../types/authContext";
import { refreshToken as refreshAccessTokenRequest } from "../api/authApi";
import { STORAGE_KEYS } from "../constants/storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJwtPayload = (token: string) => {
    try {
        const payload = token.split(".")[1];

        if (!payload) {
            return null;
        }

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(
            normalized.length + ((4 - (normalized.length % 4)) % 4),
            "="
        );

        return JSON.parse(window.atob(padded));
    } catch {
        return null;
    }
};

const resolveUserFromToken = (token: string): AuthUser | null => {
    const payload = parseJwtPayload(token);

    if (!payload) {
        return null;
    }

    const roles = Array.isArray(payload.roles)
        ? payload.roles
        : Array.isArray(payload.role)
            ? payload.role
            : typeof payload.role === "string"
                ? [payload.role]
                : [];

    return {
        id: payload.sub ?? payload.user_id ?? payload.id,
        username: payload.username ?? payload.preferred_username ?? payload.sub,
        email: payload.email ?? undefined,
        fullName: payload.name ?? payload.full_name ?? undefined,
        role: roles[0],
        roles,
    };
};

const resolveExpiresAt = (token: string, expiresIn?: number) => {
    if (expiresIn) {
        return Date.now() + expiresIn * 1000;
    }

    const payload = parseJwtPayload(token);

    if (!payload || !payload.exp) {
        return undefined;
    }

    return Number(payload.exp) * 1000;
};

const getStoredSession = (): AuthSession | null => {
    const accessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!accessToken) {
        return null;
    }

    const refreshToken = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? undefined;
    const expiresAt = Number(sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT) ?? "0") || undefined;
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const rolesRaw = sessionStorage.getItem(STORAGE_KEYS.ROLES);

    return {
        accessToken,
        refreshToken,
        expiresAt,
        user: user ? (JSON.parse(user) as AuthUser) : resolveUserFromToken(accessToken),
        roles: rolesRaw ? JSON.parse(rolesRaw) as string[] : [],
    };
};

export function AuthProvider({ children }: AuthProviderProps) {
    const existingSession = getStoredSession();
    const [user, setUser] = useState<AuthUser | null>(existingSession?.user ?? null);
    const [roles, setRoles] = useState<string[]>(existingSession?.roles ?? []);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(existingSession?.accessToken));
    const [isLoading, setIsLoading] = useState(false);

    const persistSession = (payload: LoginResponse) => {
        const accessToken = payload.access_token;
        const refreshToken = payload.refresh_token ?? sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? undefined;
        const expiresAt = payload.expires_at
            ? new Date(payload.expires_at).getTime()
            : resolveExpiresAt(accessToken, payload.expires_in);
        const resolvedUser = payload.user ?? resolveUserFromToken(accessToken) ?? user;
        const roleFromPayload = payload.role ?? payload.user?.role;
        const serverRoles = payload.roles ?? payload.user?.roles ?? [];
        const resolvedRoles = serverRoles.length > 0
            ? serverRoles.filter((role): role is string => typeof role === "string")
            : roleFromPayload
                ? [roleFromPayload]
                : roles;

        if (accessToken) {
            sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        }

        if (refreshToken) {
            sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        if (typeof expiresAt === "number") {
            sessionStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt));
        }

        const normalizedUser = resolvedUser ?? null;
        if (normalizedUser) {
            sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
        }

        if (resolvedRoles.length > 0) {
            sessionStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(resolvedRoles));
        }

        setUser(normalizedUser);
        setRoles(resolvedRoles);
        setIsAuthenticated(Boolean(accessToken));
    };

    const clearSession = () => {
        sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem(STORAGE_KEYS.ROLES);
        setUser(null);
        setRoles([]);
        setIsAuthenticated(false);
    };

    const login = (payload: LoginResponse) => {
        persistSession(payload);
    };

    const logout = () => {
        clearSession();
    };

    const refreshAccessToken = async () => {
        const refreshTokenValue = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshTokenValue) {
            throw new Error("No refresh token available");
        }

        setIsLoading(true);

        try {
            const refreshed = await refreshAccessTokenRequest(refreshTokenValue);
            persistSession(refreshed);
            return refreshed.access_token;
        } finally {
            setIsLoading(false);
        }
    };

    const hasRole = (role: string) =>
        roles.some((currentRole) => currentRole.toLowerCase() === role.toLowerCase());

    const value = useMemo<AuthContextType>(
        () => ({
            isAuthenticated,
            isLoading,
            user,
            roles,
            login,
            logout,
            refreshAccessToken,
            hasRole,
        }),
        [isAuthenticated, isLoading, user, roles]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
