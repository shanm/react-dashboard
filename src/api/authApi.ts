import { API_URL } from "./config";
import { STORAGE_KEYS } from "../constants/storage";
import type { LoginRequest, LoginResponse, RefreshTokenRequest, ResetPasswordRequest } from "../types/auth";

const buildUrlEncodedBody = (payload: Record<string, string>) => {
    const form = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
        form.append(key, value);
    });

    return form.toString();
};

const parseErrorMessage = async (response: Response) => {
    try {
        const errorData = await response.json();

        if (typeof errorData?.detail === "string") {
            return errorData.detail;
        }

        if (typeof errorData?.message === "string") {
            return errorData.message;
        }

        if (typeof errorData?.error === "string") {
            return errorData.error;
        }
    } catch {
        // Ignore JSON parsing errors and fall back to default message.
    }

    return "Request failed";
};

export function getAccessToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function requestWithAuth<T>(
    input: string,
    init: RequestInit = {},
    refreshOnUnauthorized = true
): Promise<T> {
    const token = getAccessToken();
    const headers = new Headers(init.headers ?? {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${input}`, {
        ...init,
        headers,
    });

    if (response.status === 401 && refreshOnUnauthorized && getRefreshToken()) {
        try {
            const refreshed = await refreshToken(getRefreshToken() as string);
            sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshed.access_token);

            if (refreshed.refresh_token) {
                sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshed.refresh_token);
            }

            const retryHeaders = new Headers(init.headers ?? {});
            retryHeaders.set("Authorization", `Bearer ${refreshed.access_token}`);

            const retryResponse = await fetch(`${API_URL}${input}`, {
                ...init,
                headers: retryHeaders,
            });

            if (!retryResponse.ok) {
                throw new Error(await parseErrorMessage(retryResponse));
            }

            return retryResponse.json() as Promise<T>;
        } catch {
            // allow downstream error handling to surface a login message
        }
    }

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    return response.json() as Promise<T>;
}

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    const payload: LoginRequest = { username, password };

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: buildUrlEncodedBody({
            username: payload.username,
            password: payload.password,
        }),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    return response.json() as Promise<LoginResponse>;
}

export async function refreshToken(refreshTokenValue: string): Promise<LoginResponse> {
    const payload: RefreshTokenRequest = { refresh_token: refreshTokenValue };

    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: buildUrlEncodedBody({
            refresh_token: payload.refresh_token,
            grant_type: "refresh_token",
        }),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    return response.json() as Promise<LoginResponse>;
}

export async function resetPassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
): Promise<void> {
    const payload: ResetPasswordRequest = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword ?? newPassword,
    };

    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken() ?? ""}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }
}

export async function getProfile(token?: string): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
            : {
                "Content-Type": "application/json",
            },
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    return response.json() as Promise<Record<string, unknown>>;
}
