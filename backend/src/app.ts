import cors from 'cors';
import express, { Express, Router } from 'express';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(authRouter: Router): Express {
  const app = express();
  app.use(cors());                       // permite que el frontend llame a la API
  app.use(express.json());               // interpreta el cuerpo JSON de las peticiones
  app.use('/api/auth', authRouter);      // todas las rutas de auth cuelgan de /api/auth
  app.use(errorHandler);                 // SIEMPRE al final: atrapa lo que se lance arriba
  return app;
}