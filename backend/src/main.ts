import { createApp } from './app';
import { Router } from 'express';
import { AuthController } from './modules/auth/AuthController';
import { AuthService } from './modules/auth/AuthService';
import { createAuthRouter } from './modules/auth/auth.routes';
import { JwtTokenService } from './auth/JwtTokenService';
import { env } from './config/env';
import { DatabaseConnection } from './database/DatabaseConnection';

import { initModels } from './database/InitModels';
import { DatabaseSeeder } from './database/seed';
import { BcryptPasswordHasher } from './modules/auth/BcryptPasswordHasher';
import { PermissionRepository } from './modules/roles/PermissionRepository';
import { RoleRepository } from './modules/roles/RoleRepository';
import { UserRepository } from './modules/users/UserRepository';


import { createAuthenticate } from './middlewares/authenticate';
import { UserController } from './modules/users/UserController';
import { UserService } from './modules/users/UserService';
import { createUserRouter } from './modules/users/user.routes';

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

const authenticate = createAuthenticate(tokenService, userRepository); // se comparte con todos los routers

const authService = new AuthService(userRepository, roleRepository, passwordHasher, tokenService);
const authController = new AuthController(authService);

const userService = new UserService(userRepository, roleRepository);
const userController = new UserController(userService);


  const app = createApp({
    auth: createAuthRouter(authController),
    users: Router(),
    events: Router(),
  });

  app.listen(env.apiPort, () => {
    console.log(`[API] Escuchando en http://localhost:${env.apiPort}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});
