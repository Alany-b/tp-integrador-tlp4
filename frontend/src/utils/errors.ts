import { ApiError } from "../api/errors";

export function getErrorMessage(caught: unknown): string {
  if (caught instanceof ApiError) {
    return caught.message;
  }
  return "Ocurrió un error inesperado.";
}
