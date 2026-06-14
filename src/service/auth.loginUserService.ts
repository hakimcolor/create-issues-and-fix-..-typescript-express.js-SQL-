import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";


export const loginUserService = async (
  email: string,
  password: string
) => {

  const query = `
    SELECT * FROM users WHERE email = $1
  `;

  const result = await pool.query(
    query,
    [email]
  );

  const user = result.rows[0];


  if (!user) {
    throw new Error("User not found");
  }


  const isMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatched) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },

    process.env.JWT_SECRET as string,
    
    {
      expiresIn: "7d",
    }
  );

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