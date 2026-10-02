export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class NetworkError extends ApiError {
  constructor() {
    super(0, "No se pudo conectar con el servidor");
    this.name = "NetworkError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ServerError extends ApiError {
  constructor(status: number, message: string) {
    super(status, message);
    this.name = "ServerError";
  }
}

export class ApiErrorFactory {
  static fromResponse(status: number, serverMessage: string | null): ApiError {
    if (status === 401) {
      return new UnauthorizedError(serverMessage ?? "Sesión expirada o credenciales inválidas");
    }
    if (status === 403) {
      return new ForbiddenError(serverMessage ?? "No tiene permiso para realizar esta acción");
    }
    if (status === 404) {
      return new NotFoundError(serverMessage ?? "El recurso solicitado no existe");
    }
    if (status >= 500) {
      return new ServerError(status, serverMessage ?? "Error interno del servidor, intente nuevamente más tarde");
    }
    return new ApiError(status, serverMessage ?? "Error inesperado al procesar la solicitud");
  }

  static network(): ApiError {
    return new NetworkError();
  }
}
