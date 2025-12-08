import express, { Request, Response } from "express";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import { vehicleRouter } from "./modules/vehicle/vehicle.route";
import { bookingRouter } from "./modules/booking/booking.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", vehicleRouter);
app.use("/api/v1", bookingRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to rentEZ",
  });
});

//global middleware
app.use((_, res: Response) => {
  res.status(404).json({ status: false, message: "Route not found" });
});

export default app;
