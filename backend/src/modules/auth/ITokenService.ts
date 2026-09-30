export interface TokenPayload {
  userId: number;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;  
  verify(token: string): TokenPayload;   
}