import { Permission } from '../roles/Permission';
import { Role } from '../roles/Role';
import { CreateUserData, IUserRepository } from './IUserRepository';
import { User } from './User';

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } }); // trae passwordHash: lo necesita el login
  }

  async findByIdWithPermissions(id: number): Promise<User | null> {
    return User.findByPk(id, {
      // include anidado: usuario -> rol -> permisos del rol
      include: [{ model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] }],
    });
  }

  async findAll(): Promise<User[]> {
    return User.findAll({
      attributes: { exclude: ['passwordHash'] }, // el listado nunca expone el hash
      include: [{ model: Role, as: 'role' }],
      order: [['id', 'ASC']],
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return User.create(data);
  }

  async updateRole(user: User, roleId: number): Promise<User> {
    user.roleId = roleId; // cambiamos el campo en la instancia...
    return user.save();   // ...y lo persistimos
  }
}