import { ApiErrorFactory, UnauthorizedError } from "./errors";
import { session } from "./storage";
import type { ISessionStorage } from "./storage";
import { Subject } from "../observer/Subject";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const DEFAULT_API_URL = "http://localhost:3000/api";

function readApiUrl(): string {
  const envUrl: unknown = import.meta.env.VITE_API_URL;
  if (typeof envUrl === "string" && envUrl !== "") {
    return envUrl;
  }
  return DEFAULT_API_URL;
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

  readonly unauthorized = new Subject<void>();
  private readonly baseUrl: string;
  private readonly storage: ISessionStorage;

  private constructor(baseUrl: string, storage: ISessionStorage) {
    this.baseUrl = baseUrl;
    this.storage = storage;
  }

  static getInstance(): ApiClient {
    if (ApiClient.instance === null) {
      ApiClient.instance = new ApiClient(readApiUrl(), session);
    }
    return ApiClient.instance;
  }

  async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {};
    const token = this.storage.getToken();
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
      throw ApiErrorFactory.network();
    }

    if (!response.ok) {
      const data = await readJson(response);
      const error = ApiErrorFactory.fromResponse(response.status, extractMessage(data));
      if (error instanceof UnauthorizedError) {
        this.storage.clear();
        this.unauthorized.notify();
      }
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await readJson(response);
    return data as T;
  }
}

export const apiClient = ApiClient.getInstance();
