
// ================= IMPORTS =================

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sequelize, DataTypes } from "sequelize";


import authMiddleware from "./authMiddleware.js";
import clientRoutes from "./routes/clientRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import Enquiry from "./models/enquiryModel.js";

import sequelize from "./models/db.js";
import Property from "./models/propertyModel.js";


// ================= CONFIG =================
dotenv.config();




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const app = express();

// ================= MIDDLEWARE (SAFE & SIMPLE) =================

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});








app.use("/api/dashboard", dashboardRouter);

// ================= DATABASE =================
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {  // for railway i will change this 
//     // host: process.env.DB_HOST || "localhost",
//     // dialect: "mysql",
//     // logging: false,

    
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialect: "mysql",
//   logging: false,

//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// }
  
// );

//for railway i am changed this

// try {
//   await sequelize.authenticate();
//   console.log("MySQL Connected ✅");
// } catch (err) {
//   console.error("MySQL Connection Error ❌", err);
// }

// ================= USER MODEL =================
const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "agent", "user"),
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

const startServer = async () => {
  try {
await sequelize.sync({ alter: true });
    console.log("User table synced ✅");

    //  i am changed this for render
// const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT} 🚀`);
//     });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (err) {
    console.error("DB Sync Error:", err);
  }
};

startServer();


// ================= AUTH ROUTES =================

// SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
        role: "user"
    });

    res.status(201).json({
      message: "Signup successful",
      userId: user.id,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user.id,
     
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ================= ROUTES =================
app.use("/api", clientRoutes);
app.use("/api", propertyRoutes);
app.use("/api",enquiryRoutes);
app.use('/uploads', express.static('uploads'));





// ================= PROFILE =================
app.get("/api/profile", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});







app.post("/api/contact_message", async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    await sequelize.query(
      "INSERT INTO contact_messages (name, email, mobile, message) VALUES (?, ?, ?, ?)",
      {
        replacements: [name, email, mobile, message],
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});







app.get("/api/contact_messages", async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM contact_messages ORDER BY id DESC"
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/api/contact_messages/:id", async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Deleting ID:", id);

    await sequelize.query(
      "DELETE FROM contact_messages WHERE id = ?",
      {
        replacements: [id],
      }
    );

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});