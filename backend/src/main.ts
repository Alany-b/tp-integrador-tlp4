import { DatabaseConnection } from './database/DatabaseConnection';
import { initModels } from './database/InitModels';

async function bootstrap(): Promise<void> {
  const db = DatabaseConnection.getInstance(); 
  await db.connect();     
  
  initModels(db.getSequelize( ) ); // Inicializamos los modelos con la instancia de Sequelize

  await db.connect(); 

  initModels(db.getSequelize());     
  await db.getSequelize().sync();

   console.log('[DB] Modelos sincronizados');

}

// Si algo falla al arrancar, mostramos el error y salimos con código 1
bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});