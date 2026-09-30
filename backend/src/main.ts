import express from 'express';
import cors from 'cors';
import { env } from './config/env';

// Base de datos y Seed
import { DatabaseConnection } from './database/DatabaseConnection';
import { initModels } from './database/InitModels';
import { DatabaseSeeder } from './database/seed';
import { BcryptPasswordHasher } from './modules/auth/BcryptPasswordHasher';
import { PermissionRepository } from './modules/roles/PermissionRepository';
import { RoleRepository } from './modules/roles/RoleRepository';
import { UserRepository } from './modules/users/UserRepository';

// Observer y Notificaciones
import { EventPublisher } from './observer/EventPublisher';
import { NotificationService } from './modules/notifications/NotificationService';
import { NotifierFactory } from './modules/notifications/NotifierFactory';

// Módulo Eventos
import { EventRepository } from './modules/events/EventRepository';
import { EventService } from './modules/events/EventService';
import { EventController } from './modules/events/EventController';
import { createEventRouter } from './modules/events/event.routes';

async function bootstrap(): Promise<void> {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // 1. Singleton: Conexión y sincronización de base de datos
  const db = DatabaseConnection.getInstance();
  await db.connect();
  initModels(db.getSequelize());
  await db.getSequelize().sync();
  console.log('[DB] Modelos sincronizados');

  // 2. Seeder de roles, permisos y usuarios de prueba
  const roleRepository = new RoleRepository();
  const userRepository = new UserRepository();
  const seeder = new DatabaseSeeder(
    roleRepository,
    new PermissionRepository(),
    userRepository,
    new BcryptPasswordHasher()
  );
  await seeder.run();

  // 3. Observer + Factory: Configuración del publicador y observador
  const publisher = new EventPublisher();
  const notifierFactory = new NotifierFactory();
  const notificationService = new NotificationService(notifierFactory);
  publisher.attach(notificationService);

  // 4. Inyección de dependencias para el recurso Eventos
  const eventRepository = new EventRepository();
  const eventService = new EventService(eventRepository, publisher);
  const eventController = new EventController(eventService);

  // 5. Rutas
  app.use('/api/events', createEventRouter(eventController));

  // 6. Arrancar servidor Express
  const port = env.apiPort || 3000;
  app.listen(port, () => {
    console.log(`[HTTP] Servidor escuchando en http://localhost:${port}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});