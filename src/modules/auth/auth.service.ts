import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, LOWER($2), $3, $4, LOWER($5)) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );

  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(
    `SELECT id, name, email,password, phone, role FROM users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found.");
  }

  const user = result.rows[0];

  const isPassValid = await bcrypt.compare(password, user.password);
  if (!isPassValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  const { password: _, ...userWithoutPass } = result.rows[0];

  return { token, user: userWithoutPass };
};

export const authService = { registerUser, loginUser };
