import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Initialize connection pool using DATABASE_URL from environment
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Neon requires SSL — rejectUnauthorized true validates the server certificate
    rejectUnauthorized: true,
  },
});
