import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const loginUserService = async (email: string, password: string) => {
  // Look up the user by email address
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = result.rows[0];

  // Throw if no account is registered with this email
  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided password against the stored hash
  const isMatched = await bcrypt.compare(password, user.password);

  // Throw if the password does not match
  if (!isMatched) {
    throw new Error('Invalid password');
  }

  // Sign JWT with user identity fields needed for authorization checks
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  // Return token alongside safe user fields — password is never included
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};
