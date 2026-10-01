import { createApp } from './app';
import { Router } from 'express';
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


import { createAuthenticate } from './middlewares/authenticate';
import { UserController } from './modules/users/UserController';
import { UserService } from './modules/users/UserService';
import { createUserRouter } from './modules/users/user.routes';

import { EventRepository } from './modules/events/EventRepository';
import { EventService } from './modules/events/EventService';
import { EventController } from './modules/events/EventController';
import { createEventRouter } from './modules/events/event.routes';
import { EventPublisher } from './observer/EventPublisher';
import { NotifierFactory } from './modules/notifications/NotifierFactory';
import { NotificationService } from './modules/notifications/NotificationService';

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

// Instanciar dependencias de eventos y notificaciones
const notifierFactory = new NotifierFactory();
const notificationService = new NotificationService(notifierFactory);

const eventPublisher = new EventPublisher();
eventPublisher.attach(notificationService);

const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository, eventPublisher);
const eventController = new EventController(eventService);

  const app = createApp({
    auth: createAuthRouter(authController),
    users: createUserRouter(userController, authenticate), 
    events: createEventRouter(eventController, authenticate),
  });

  app.listen(env.apiPort, () => {
    console.log(`[API] Escuchando en http://localhost:${env.apiPort}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});
