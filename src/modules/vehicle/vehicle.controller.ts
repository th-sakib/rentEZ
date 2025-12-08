import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);

    const { updated_at, created_at, ...rest } = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: rest,
    });
  } catch (error: any) {
    if (error.message === "Required field is not provided") {
      res.status(404).json({
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

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      throw new Error("vehicle Id not found");
    }

    const result = await vehicleService.getVehicle(vehicleId);
    if (result.rows.length === 0) {
      throw new Error("vehicle not found");
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (
      error.message === "vehicle Id not found" ||
      error.message === "vehicle not found"
    ) {
      res.status(404).json({
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

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      throw new Error("vehicle Id not found");
    }

    const result = await vehicleService.updateVehicle(vehicleId, req.body);

    const { created_at, updated_at, ...rest } = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: rest,
    });
  } catch (error: any) {
    if (error.message === "vehicle Id not found") {
      res.status(404).json({
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

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      throw new Error("vehicle Id not found");
    }

    await vehicleService.deleteVehicle(vehicleId);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "vehicle Id not found") {
      res.status(404).json({
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

export const vehicleController = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
