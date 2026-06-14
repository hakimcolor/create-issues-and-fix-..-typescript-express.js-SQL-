import { pool } from './db.js';

export const migrate = async () => {
  // Create users table if it does not already exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255)  NOT NULL,
      email       VARCHAR(255)  NOT NULL UNIQUE,
      password    VARCHAR(255)  NOT NULL,
      role        VARCHAR(20)   NOT NULL DEFAULT 'contributor'
                  CHECK (role IN ('contributor', 'maintainer')),
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create issues table if it does not already exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id           SERIAL PRIMARY KEY,
      title        VARCHAR(150)  NOT NULL,
      description  TEXT          NOT NULL,
      type         VARCHAR(20)   NOT NULL
                   CHECK (type IN ('bug', 'feature_request')),
      status       VARCHAR(20)   NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open', 'in_progress', 'resolved')),
      reporter_id  INTEGER       NOT NULL,
      created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables are ready');
};
