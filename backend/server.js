import dotenv from "dotenv";
dotenv.config();  // <-- only once

import express from "express";
import cors from "cors";
import propertyRoutes from "./routes/propertyRoutes.js";
import sequelize from "./models/propertyModel.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", propertyRoutes);

// Test DB connection
sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected"))
  .catch(err => console.log("❌ DB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
