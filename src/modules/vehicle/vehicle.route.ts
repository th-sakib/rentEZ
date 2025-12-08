import e from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = e.Router();

// POST: /api/v1/vehicles => create vehicle
router.post("/vehicles", auth("admin"), vehicleController.createVehicle);
// GET: /api/v1/vehicles => get all vehicles
router.get(
  "/vehicles",
  auth("admin", "customer"),
  vehicleController.getVehicles
);
// GET /api/v1/vehicles/:vehicleId => get specific vehicle
router.get(
  "/vehicles/:vehicleId",
  auth("admin", "customer"),
  vehicleController.getVehicle
);
// PUT /api/v1/vehicles/:vehicleId => update vehicle detail
router.put(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleController.updateVehicle
);
// DELETE /api/v1/vehicles/:vehicleId => delete vehicle
router.delete(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleController.deleteVehicle
);

export const vehicleRouter = router;
