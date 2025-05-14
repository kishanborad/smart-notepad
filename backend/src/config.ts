// Configuration interface
export interface Config {
  JWT_SECRET: string;
  PORT: number;
  MONGODB_URI: string;
}

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Configuration constants
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export const PORT: number = Number(process.env.PORT) || 5050;
export const MONGODB_URI: string = process.env.MONGODB_URI!;

// Configuration object
const config: Config = {
  JWT_SECRET,
  PORT,
  MONGODB_URI,
};

export default config; 