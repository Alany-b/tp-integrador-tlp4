import { ApiError } from "../api/client";

export function getErrorMessage(caught: unknown): string {
  if (caught instanceof ApiError) {
    return caught.message;
  }
  return "Ocurrió un error inesperado.";
}
