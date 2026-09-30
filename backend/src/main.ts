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
  
  initModels(db.getSequelize( ) ); // Inicializamos los modelos con la instancia de Sequelize

  await db.connect(); 

  initModels(db.getSequelize());     
  await db.getSequelize().sync();

   console.log('[DB] Modelos sincronizados');



  const roleRepository = new RoleRepository();
  const userRepository = new UserRepository();
  const seeder = new DatabaseSeeder(
    roleRepository,
    new   PermissionRepository(),
    userRepository,
    new   BcryptPasswordHasher()
  );
  await seeder.run();
  
}

// Si algo falla al arrancar, mostramos el error y salimos con código 1
bootstrap().catch((error: unknown) => {
  console.error('Error al iniciar:', error);
  process.exit(1);
});