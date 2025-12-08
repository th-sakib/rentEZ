import e from "express";
import { authController } from "./auth.controller";

const router = e.Router();

// POST api/v1/auth/signup
router.post("/signup", authController.registerUser);
// POST /api/v1/auth/signin
router.post("/signin", authController.loginUser);

export const authRouter = router;
