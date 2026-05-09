
import express from "express";
import authMiddleware from "../authMiddleware.js";

import {

  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  requestDeleteProperty,
  getPropertyById
} from "../controllers/propertyController.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.get("/properties", getProperties);

router.get("/properties/:id", getPropertyById);

// ================= AGENT ROUTES =================
router.get(
  "/agent/properties",
  authMiddleware("agent"),
  getAgentProperties
);

router.post(
  "/properties",
  authMiddleware("agent"),
  addProperty
);

router.put(
  "/properties/:id",
  authMiddleware("agent"),
  updateProperty
);

router.put(
  "/properties/:id/request-delete",
  authMiddleware("agent"),
  requestDeleteProperty
);


// ================= ADMIN ROUTES =================
router.delete(
  "/properties/:id",
  authMiddleware("admin"),
  deleteProperty
);

export default router;
