// Clase base de todos los errores "esperables" de la aplicación
export class AppError extends Error {
  constructor(
    message: string,                  // texto que verá el cliente
    public readonly statusCode: number // código HTTP asociado
  ) {
    super(message);                   // inicializa el Error nativo con el mensaje
    this.name = new.target.name;      // el nombre de la clase concreta (ValidationError, etc.)
  }
}

// 400: la entrada es inválida (email mal formado, campo faltante...)
export class ValidationError extends AppError {
  constructor(message: string) { super(message, 400); }
}

// 401: no hay sesión o el token es inválido
export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') { super(message, 401); }
}

// 403: hay sesión, pero el rol no tiene el permiso
export class ForbiddenError extends AppError {
  constructor(message = 'No tenés permiso para esta acción') { super(message, 403); }
}

// 404: el recurso pedido no existe
export class NotFoundError extends AppError {
  constructor(message: string) { super(message, 404); }
}

// 409: conflicto con el estado actual (por ejemplo, email ya registrado)
export class ConflictError extends AppError {
  constructor(message: string) { super(message, 409); }
}