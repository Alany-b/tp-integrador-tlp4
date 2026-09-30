import { ValidationError } from './AppError';

// Confirma que el cuerpo sea un objeto y lo trata como diccionario de valores desconocidos
function asRecord(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('El cuerpo de la petición es inválido');
  }
  return body as Record<string, unknown>;
}

// Lee un campo de texto obligatorio y no vacío
export function readString(body: unknown, field: string): string {
  const value = asRecord(body)[field];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`El campo "${field}" es obligatorio`);
  }
  return value.trim();
}

// Lee un email y valida el formato básico
export function readEmail(body: unknown, field = 'email'): string {
  const value = readString(body, field).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new ValidationError(`El campo "${field}" no es un email válido`);
  }
  return value;
}

// Convierte un valor (por ejemplo req.params.id) en entero positivo
export function readPositiveInt(value: unknown, field: string): number {
  const parsed = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof parsed !== 'number' || !Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`"${field}" debe ser un número entero positivo`);
  }
  return parsed;
}