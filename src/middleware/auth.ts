import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { pool } from "../config/db";

const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("You are not authenticated!");
      }

      const decodedPayload = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decodedPayload.email,
      ]);
      if (result.rows.length === 0) {
        throw new Error("User not found!");
      }

      req.user = decodedPayload;

      if (roles.length && !roles.includes(decodedPayload.role)) {
        throw new Error("Unauthorized!");
      }

      next();
    } catch (error: any) {
      if (error.message === "TokenExpiredError") {
        res.status(401).json({
          status: false,
          message: "Token expired",
          errors: error.message,
        });
      }

      if (error.message === "JsonWebTokenError") {
        res.status(401).json({
          status: false,
          message: "Invalid token",
          errors: error.message,
        });
      }

      res.status(500).json({
        status: false,
        message: "internal server error",
        errors: error.message,
      });
    }
  };
};

export default auth;
