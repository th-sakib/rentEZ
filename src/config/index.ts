import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: process.env.PORT,
  connection_str: process.env.CONNECTION_STR,
  jwtSecret: process.env.JWT_SECRET,
};
