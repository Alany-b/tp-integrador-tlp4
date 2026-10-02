export interface ISessionStorage {
  getToken(): string | null;
  getUser(): string | null;
  save(token: string, userJson: string): void;
  clear(): void;
}

export class LocalStorageSessionAdapter implements ISessionStorage {
  private readonly tokenKey = "token";
  private readonly userKey = "user";

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): string | null {
    return localStorage.getItem(this.userKey);
  }

  save(token: string, userJson: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, userJson);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}

export const session: ISessionStorage = new LocalStorageSessionAdapter();
