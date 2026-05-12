import jwt from "jsonwebtoken";

const authMiddleware = (role) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token missing or invalid" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // IMPORTANT SAFETY CHECK
      if (!decoded) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      req.user = decoded;

      // role check (SAFE)
      if (role && (!decoded.role || decoded.role !== role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();

    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

export default authMiddleware;