import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

const updateUser = async (id: number, payload: Record<string, unknown>) => {
  const result = await pool.query(
    `
      UPDATE users
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          role = COALESCE($4, role),
          updated_at = NOW()
      WHERE id=$5 RETURNING *
    `,
    [payload.name, payload.email, payload.phone, payload.role, id]
  );

  const { password, updated_at, created_at, ...rest } = result.rows[0];

  return rest;
};

const deleteUser = async (userId: string, currentUser: JwtPayload) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  if (result.rows.length === 0) {
    throw new Error("user not found");
  }
  // check booking status
  const statusQuery = await pool.query(
    `
      SELECT * FROM bookings 
      WHERE customer_id=$1
      `,
    [userId]
  );
  if (statusQuery.rows.length === 0) {
    await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
    return true;
  }
  if (statusQuery.rows[0].status !== "active") {
    await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

    return true;
  }
};

export const userService = { getUsers, updateUser, deleteUser };
