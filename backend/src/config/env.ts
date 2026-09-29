import dotenv from 'dotenv'; 

dotenv.config();

// Lee una variable obligatoria; si falta, corta el arranque con un error claro
function required(name: string): string {
  const value = process.env[name]; // string | undefined
  if (value === undefined || value === '') {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value; // acá TypeScript ya sabe que es string
}

// Objeto de configuración tipado, único lugar donde se toca process.env
export const env = {
  db: {
    host: required('DB_HOST'),
    port: Number(required('DB_PORT')), 
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    name: required('DB_NAME'),
  },
  jwtSecret: required('JWT_SECRET'),
  apiPort: Number(process.env.API_PORT ?? 3000)
} as const; // readonly: nadie puede modificar la configuración en runtime