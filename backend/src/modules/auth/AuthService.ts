import { ConflictError, UnauthorizedError } from '../../middlewares/AppError';
import { IPasswordHasher } from './IPasswordHasher';
import { IRoleRepository } from '../roles/IRoleRepository';
import { ROLES } from '../roles/permissions';
import { User } from '../users/User';
import { IUserRepository } from '../users/IUserRepository';
import { AuthResult, LoginInput, RegisterInput } from './auth.types';
import { ITokenService } from './ITokenService';

export class AuthService {
  // Cuatro dependencias, todas abstracciones inyectadas
  constructor(
    private readonly users: IUserRepository,
    private readonly roles: IRoleRepository,
    private readonly hasher: IPasswordHasher,
    private readonly tokens: ITokenService
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();

    // Regla de negocio: el email es único
    if ((await this.users.findByEmail(email)) !== null) {
      throw new ConflictError('El email ya está registrado');
    }

    // Todo usuario nuevo nace con el rol "usuario" (RF2)
    const role = await this.roles.findByName(ROLES.USUARIO);
    if (role === null) {
      throw new Error('El rol "usuario" no existe: el seed no se ejecutó'); // error nuestro: 500
    }

    const user = await this.users.create({
      name: input.name,
      email,
      passwordHash: await this.hasher.hash(input.password), // guardamos el hash, nunca la clave
      roleId: role.id,
    });
    return this.buildResult(user.id);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    const passwordOk = user !== null && (await this.hasher.compare(input.password, user.passwordHash));

    // Mismo mensaje para "no existe" y "clave incorrecta": no revelamos qué emails están registrados
    if (user === null || !passwordOk) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const role = await this.roles.findById(user.roleId);
    if (role === null) {
      throw new Error('El usuario tiene un rol inexistente');
    }
    return this.buildResult(user.id);
  }

  // Arma la respuesta leyendo al usuario con su rol y los permisos de ese rol
  private async buildResult(userId: number): Promise<AuthResult> {
    const user = await this.users.findByIdWithPermissions(userId);
    if (user === null || user.role === undefined) {
      throw new Error('El usuario no tiene un rol asignado');
    }
    return {
      token: this.tokens.sign({ userId: user.id }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions: (user.role.permissions ?? []).map((permission) => permission.name),
      },
    };
  }
}