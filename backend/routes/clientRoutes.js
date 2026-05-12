// import express from "express";
// import authMiddleware from "../authMiddleware.js";

// const router = express.Router();


// router.get("/client-inquiries", authMiddleware("agent"), async (req, res) => {
//   try {
   
//     const inquiries = [
//       { name: "John", message: "Interested in property #1", date: "2026-02-18" },
//       { name: "Aditi", message: "Can I visit tomorrow?", date: "2026-02-18" }
//     ];
//     res.json(inquiries);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


// router.post("/contact-user", authMiddleware("agent"), async (req, res) => {
//   try {
//     const { name, email, message } = req.body;
//     console.log("Message to user:", name, email, message);
   
//     res.json({ message: "Message sent successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;
