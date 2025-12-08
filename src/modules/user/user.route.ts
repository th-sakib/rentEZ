import e, { Request, Response } from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

const router = e.Router();

// api/v1/users => get all users
router.get("/users", auth("admin"), userController.getUsers);
// api/v1/users/:userId => update user
router.put(
  "/users/:userId",
  auth("admin", "customer"),
  userController.updateUser
);
// api/v1/users/:userId => delete user
router.delete("/users/:userId", auth("admin"), userController.deleteUser);

export const userRouter = router;
