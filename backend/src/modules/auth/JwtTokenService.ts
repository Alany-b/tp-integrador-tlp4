import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../../middlewares/AppError';
import { ITokenService, TokenPayload } from './ITokenService';

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,                   
    private readonly expiresInSeconds: number = 60 * 60 * 2 
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign({ userId: payload.userId }, this.secret, { expiresIn: this.expiresInSeconds });
  }

  verify(token: string): TokenPayload {
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, this.secret); // lanza si la firma es falsa o el token venció
    } catch {
      throw new UnauthorizedError('Token inválido o vencido');
    }
    // Verificamos la forma del contenido antes de confiar en él
    if (typeof decoded === 'string' || typeof decoded.userId !== 'number') {
      throw new UnauthorizedError('Token inválido');
    }
    return { userId: decoded.userId };
  }
}