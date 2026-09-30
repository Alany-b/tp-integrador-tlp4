// Lo que el middleware "authenticate" deja disponible para el resto de la cadena
export interface AuthContext {
  userId: number;
  role: string;
  permissions: string[];
}

// Le decimos a TypeScript que Request ahora puede traer `auth`
declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext; // opcional: solo existe después de pasar por authenticate
    }
  }
}