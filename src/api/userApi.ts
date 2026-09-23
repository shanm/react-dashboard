import type { User } from "../types/user";
import { requestWithAuth } from "./authApi";

function normalizeUsersResponse(payload: unknown): User[] {
    if (Array.isArray(payload)) {
        return payload as User[];
    }

    if (payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;

        for (const key of ["users", "data", "items", "results"]) {
            const value = record[key];
            if (Array.isArray(value)) {
                return value as User[];
            }
        }
    }

    return [];
}

export async function getUsers(): Promise<User[]> {
    const data = await requestWithAuth<unknown>("/users", { method: "GET" });
    return normalizeUsersResponse(data);
}

export async function getCurrentUser(): Promise<User> {
    return requestWithAuth<User>("/users/me", { method: "GET" });
}
