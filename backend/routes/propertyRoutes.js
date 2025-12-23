import express from "express";
import { getProperties, addProperty } from "../controllers/propertyController.js";

const router = express.Router();

// GET /api/properties?type=buy
router.get("/properties", getProperties);

// POST /api/properties
router.post("/properties", addProperty);

export default router;
