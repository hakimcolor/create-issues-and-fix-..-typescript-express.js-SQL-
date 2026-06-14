import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export const createUserService = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
        
    const existingUserQuery = `
        SELECT * FROM users WHERE email = $1
    `;

    const existingUser = await pool.query(
        existingUserQuery,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exists");
    }

    const hashPass = await bcrypt.hash( password, 10 );

    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at
    `;

    const values = [name, email, hashPass, role];

    const result = await pool.query(query, values);

    return result.rows[0];
};