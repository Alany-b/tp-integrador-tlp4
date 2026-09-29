import { DatabaseConnection } from './database/DatabaseConnection';

async function bootstrap(): Promise<void> {
  const db = DatabaseConnection.getInstance(); 
  await db.connect();                      
}
// Si algo falla al arrancar, mostramos el error y salimos con código 1
bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});