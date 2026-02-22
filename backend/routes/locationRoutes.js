import express from "express";
import {
  createServiceAreaController,
  deleteServiceAreaController,
  getAdminServiceAreasController,
  getServiceAreasController,
  updateServiceAreaController,
} from "../controllers/locationController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/service-areas", getServiceAreasController);
router.get(
  "/admin/service-areas",
  requireSignIn,
  isAdmin,
  getAdminServiceAreasController
);
router.post(
  "/admin/service-areas",
  requireSignIn,
  isAdmin,
  createServiceAreaController
);
router.put(
  "/admin/service-areas/:id",
  requireSignIn,
  isAdmin,
  updateServiceAreaController
);
router.delete(
  "/admin/service-areas/:id",
  requireSignIn,
  isAdmin,
  deleteServiceAreaController
);

export default router;
