export interface IPasswordHasher {
  hash(plain: string): Promise<string>;                    // texto plano -> hash
  compare(plain: string, hash: string): Promise<boolean>;  // ¿coincide con el hash guardado?
}