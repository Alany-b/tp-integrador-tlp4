import { createApp } from './app';
import { AuthController } from './modules/auth/AuthController';
import { AuthService } from './modules/auth/AuthService';
import { createAuthRouter } from './modules/auth/auth.routes';
import { JwtTokenService } from './modules/auth/JwtTokenService';
import { env } from './config/env';
import { DatabaseConnection } from './database/DatabaseConnection';
import { initModels } from './database/InitModels';
import { DatabaseSeeder } from './database/seed';
import { BcryptPasswordHasher } from './modules/auth/BcryptPasswordHasher';
import { PermissionRepository } from './modules/roles/PermissionRepository';
import { RoleRepository } from './modules/roles/RoleRepository';
import { UserRepository } from './modules/users/UserRepository';

async function bootstrap(): Promise<void> {
  const db = DatabaseConnection.getInstance();
  await db.connect();

  initModels(db.getSequelize());
  await db.getSequelize().sync();
  console.log('[DB] Modelos sincronizados');

  const roleRepository = new RoleRepository();
  const userRepository = new UserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.jwtSecret);

  const seeder = new DatabaseSeeder(
    roleRepository,
    new PermissionRepository(),
    userRepository,
    passwordHasher
  );
  await seeder.run();

  const authService = new AuthService(userRepository, roleRepository, passwordHasher, tokenService);
  const authController = new AuthController(authService);
  const app = createApp(createAuthRouter(authController));

  app.listen(env.apiPort, () => {
    console.log(`[API] Escuchando en http://localhost:${env.apiPort}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});
