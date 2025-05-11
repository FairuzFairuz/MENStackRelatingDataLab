import jwt from "jsonwebtoken";

export const isSignedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <TOKEN>"

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.decoded = decoded; // Store userId for later use
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
