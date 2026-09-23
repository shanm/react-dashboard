export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthUser {
    id?: string | number;
    username?: string;
    email?: string;
    fullName?: string;
    role?: string;
    roles?: string[];
    [key: string]: unknown;
}

export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    expires_at?: string;
    user?: AuthUser;
    roles?: string[];
    role?: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface ResetPasswordRequest {
    current_password: string;
    new_password: string;
    confirm_password?: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: AuthUser | null;
    roles?: string[];
}
