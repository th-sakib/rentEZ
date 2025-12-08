import { Request, Response } from "express";
import { userService } from "./user.service";
import { pool } from "../../config/db";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const paramsID = req.params.userId;
    const id = Number(paramsID);

    if (id === 0) {
      return res.status(404).json({
        success: false,
        message: "No id found",
        errors: "No id found",
      });
    }

    if (id !== 0 && req.user?.role === "admin") {
      const result = await userService.updateUser(id, req.body);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
      });
    }

    if (
      id !== 0 &&
      req.user?.role === "customer" &&
      Number(req.user?.id) === Number(id)
    ) {
      if (req.body?.role === "admin") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "Unauthorized",
        });
      }

      const result = await userService.updateUser(id, req.body);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      errors: "Unauthorized",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "UserId not found",
      errors: "UserId not found",
    });
  }

  try {
    await userService.deleteUser(userId, req.user!);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
};
