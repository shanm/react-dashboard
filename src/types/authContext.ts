import type { ReactNode } from "react";

import type { AuthUser, LoginResponse } from "./auth";

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AuthUser | null;
    roles: string[];
    login: (payload: LoginResponse) => void;
    logout: () => void;
    refreshAccessToken: () => Promise<string>;
    hasRole: (role: string) => boolean;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
}
