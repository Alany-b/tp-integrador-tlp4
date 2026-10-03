import { Subject } from "../observer/Subject";
import type { Observer } from "../observer/Subject";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const DEFAULT_API_URL = "http://localhost:3000/api";
const TOKEN_KEY = "token";
const USER_KEY = "user";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function saveSession(token: string, userJson: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, userJson);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function readApiUrl(): string {
  const envUrl: unknown = import.meta.env.VITE_API_URL;
  if (typeof envUrl === "string" && envUrl !== "") {
    return envUrl.replace(/\/$/, "");
  }
  return DEFAULT_API_URL;
}

function defaultMessage(status: number): string {
  if (status === 401) {
    return "Sesión expirada o credenciales inválidas";
  }
  if (status === 403) {
    return "No tiene permiso para realizar esta acción";
  }
  if (status === 404) {
    return "El recurso solicitado no existe";
  }
  if (status >= 500) {
    return "Error interno del servidor, intente nuevamente más tarde";
  }
  return "Error inesperado al procesar la solicitud";
}

function extractMessage(data: unknown): string | null {
  if (typeof data === "object" && data !== null && "error" in data) {
    const message: unknown = data.error;
    if (typeof message === "string" && message !== "") {
      return message;
    }
  }
  return null;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export class ApiClient {
  private static instance: ApiClient | null = null;

  private readonly baseUrl: string;
  private readonly unauthorized = new Subject<void>();

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static getInstance(): ApiClient {
    if (ApiClient.instance === null) {
      ApiClient.instance = new ApiClient(readApiUrl());
    }
    return ApiClient.instance;
  }

  onUnauthorized(observer: Observer<void>): () => void {
    return this.unauthorized.subscribe(observer);
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  private async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token !== null) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new ApiError(0, "No se pudo conectar con el servidor");
    }

    if (!response.ok) {
      const data = await readJson(response);
      const message = extractMessage(data) ?? defaultMessage(response.status);
      if (response.status === 401) {
        clearSession();
        this.unauthorized.notify();
      }
      throw new ApiError(response.status, message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await readJson(response);
    return data as T;
  }
}

export const apiClient = ApiClient.getInstance();
