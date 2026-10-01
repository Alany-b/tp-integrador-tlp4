// Lo que devolvemos de un usuario: nunca el passwordHash
export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
}