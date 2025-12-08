import e, { Request, Response } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = e.Router();
// POST /api/v1/bookings => create booking
router.post(
  "/bookings",
  auth("admin", "customer"),
  bookingController.createBooking
);
// GET /api/v1/bookings => get all bookings(as admin) your bookings (as customer)
router.get(
  "/bookings",
  auth("admin", "customer"),
  bookingController.getBookings
);
// PUT /api/v1/bookings/:bookingId => get all bookings(as admin) your bookings (as customer)
router.put(
  "/bookings/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);

export const bookingRouter = router;
