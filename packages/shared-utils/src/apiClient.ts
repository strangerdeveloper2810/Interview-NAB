export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "Api Error"
    }
}

const API_BASE = "/api"

let refreshPromise: Promise<boolean> | null = null;

const refreshToken = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            credentials: "include"
        })
        return response.ok
    } catch {
        return false;
    }
}

const refreshTokenOnce = (): Promise<boolean> => {
    if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => refreshPromise = null)
    }
    return refreshPromise
}

const AUTH_ENDPOINTS = ['auth/login', 'auth/register', 'auth/refresh'];

const isAuthEndpoint = (endpoint: string): boolean =>
    AUTH_ENDPOINTS.some((e) => endpoint.replace(/^\//, '').startsWith(e));

const request = async<T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE}/${endpoint.replace(/^\//, '')}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': "application/json",
        },
        credentials: "include",
        ...options
    })
    if (response.status === 401 && !isAuthEndpoint(endpoint)) {
        const refreshed = await refreshTokenOnce();
        if (refreshed) {
            return request<T>(endpoint, options) //retry 1 lan
        }
        window.location.href = "/auth/login"
        throw new ApiError(401, "Session expired")
    }
    if (!response.ok) {
        const body = await response.json().catch(() => ({ message: response.statusText }))
        throw new ApiError(response.status, body.message)
    }
    return response.json();
}

export const apiClient = {
    get: <T>(url: string) => request<T>(url),
    post: <T>(url: string, body: unknown) =>
        request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(url: string, body: unknown) =>
        request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}
