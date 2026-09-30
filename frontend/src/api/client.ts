const envUrl: unknown = import.meta.env.VITE_API_URL;

const API_URL: string = typeof envUrl === "string" && envUrl !== "" ? envUrl : "http://localhost:3000/api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
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

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
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
      removeToken();
      localStorage.removeItem(USER_KEY);
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await readJson(response);
  return data as T;
}
