import express from "express";
import { createEnquiry } from "../controllers/enquiryController.js";

import authMiddleware from "../authMiddleware.js";
import { getAgentEnquiries } from "../controllers/enquiryController.js";


const router = express.Router();


router.post("/enquiries", createEnquiry);
router.get(
  "/agent/enquiries",
  authMiddleware("agent"),
  getAgentEnquiries
);

export default router;

