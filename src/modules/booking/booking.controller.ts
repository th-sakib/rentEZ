import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { result, vehicle } = await bookingService.createBooking(req.body);

    const { updated_at, created_at, ...rest } = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...rest,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price,
        },
      },
    });
  } catch (error: any) {
    if (
      error.message === "Required field is not provided" ||
      error.message === "Vehicle not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
        errors: error.message,
      });
    }
    if (
      error.message === "Vehicle not available" ||
      error.message === "end date cannot be before start date"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getBookings(
      req.user?.role,
      req.user?.id
    );
    res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: result?.rows,
    });
  } catch (error: any) {
    if (
      error.message === "Required field is not provided" ||
      error.message === "Vehicle not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
        errors: error.message,
      });
    }
    if (
      error.message === "Vehicle not available" ||
      error.message === "end date cannot be before start date"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  if (!bookingId) {
    throw new Error("Booking id not found");
  }

  const { status } = req.body;
  if (!status) {
    throw new Error("status not found");
  }

  try {
    const result = await bookingService.updateBookings(
      req.user?.role,
      bookingId,
      status
    );

    if (req.user?.role === "customer") {
      const { created_at, updated_at, ...rest } = result?.rows[0];
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: rest,
      });
    }
    if (req.user?.role === "admin") {
      const { created_at, updated_at, ...rest } = result;
      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: rest,
      });
    }
  } catch (error: any) {
    if (
      error.message === "Booking id not found" ||
      error.message === "status not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
        errors: error.message,
      });
    }
    if (error.message === "invalid status") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

export const bookingController = { createBooking, getBookings, updateBooking };
