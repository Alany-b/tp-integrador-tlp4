import { NotFoundError, ValidationError } from '../../middlewares/AppError';
import { IRoleRepository } from '../roles/IRoleRepository';
import { ROLES } from '../roles/permissions';
import { IUserRepository } from './IUserRepository';
import { User } from './User';
import { UserSummary } from './user.types';

export class UserService {
  constructor(
    private readonly users: IUserRepository,
    private readonly roles: IRoleRepository
  ) {}

  async list(): Promise<UserSummary[]> {
    const users = await this.users.findAll();
    return users.map((user) => this.toSummary(user, user.role?.name ?? ''));
  }

  async assignRole(userId: number, roleName: string): Promise<UserSummary> {
    // Regla de negocio: solo se aceptan los roles que existen en el sistema
    const validRoles: readonly string[] = Object.values(ROLES);
    if (!validRoles.includes(roleName)) {
      throw new ValidationError(`Rol inválido. Opciones: ${validRoles.join(', ')}`);
    }

    const user = await this.users.findById(userId);
    if (user === null) {
      throw new NotFoundError('El usuario no existe');
    }
    const role = await this.roles.findByName(roleName);
    if (role === null) {
      throw new Error(`El rol "${roleName}" no está cargado: el seed no se ejecutó`);
    }

    const updated = await this.users.updateRole(user, role.id);
    return this.toSummary(updated, role.name);
  }

  private toSummary(user: User, roleName: string): UserSummary {
    return { id: user.id, name: user.name, email: user.email, role: roleName };
  }
}