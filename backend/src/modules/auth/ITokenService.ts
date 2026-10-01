export interface TokenPayload {
  userId: number;
  roleId: number;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;  
  verify(token: string): TokenPayload;   
}