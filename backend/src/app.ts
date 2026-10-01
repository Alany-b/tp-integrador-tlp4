import cors from 'cors';
import express, { Express, Router } from 'express';
import { errorHandler } from './middlewares/errorHandler';

// Cada módulo aporta su router; en el Hito 5 se suman events, subscriptions y notifications
export interface AppRouters {
  auth: Router;
  users: Router;
    events: Router;
}

export function createApp(routers: AppRouters): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', routers.auth);
  app.use('/api/users', routers.users);
  app.use('/api/events', routers.events);

  // Si ninguna ruta coincidió, respondemos 404 con el mismo formato de error
  app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });
  app.use(errorHandler); // siempre al final
  return app;
}   