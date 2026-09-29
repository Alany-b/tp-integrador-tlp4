import { Sequelize } from 'sequelize';
import { env } from '../config/env';

export class DatabaseConnection {
  // Guarda la única instancia; es static, así que pertenece a la clase, no a un objeto
  private static instance: DatabaseConnection | null = null;

  // La instancia de Sequelize que encapsula la conexión
  private readonly sequelize: Sequelize;

  // Constructor PRIVADO: desde afuera nadie puede hacer `new DatabaseConnection()`
  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
      host: env.db.host,
      port: env.db.port,
      dialect: 'postgres', 
      logging: false,     
    });
  }

  // Único punto de acceso: crea la instancia la primera vez y la reutiliza después
  public static getInstance(): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }


  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  public async connect(): Promise<void> {
    await this.sequelize.authenticate();
    console.log('[DB] Conexión establecida');
  }

  
  public async close(): Promise<void> {
    await this.sequelize.close();
  }
}