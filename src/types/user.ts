export interface User {
    id: number;
    name?: string;
    email?: string;
    username?: string;
    role?: string;
    roles?: string[];
    [key: string]: unknown;
}
