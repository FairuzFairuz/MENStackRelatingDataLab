import express from "express";
import { register, login, refresh } from "../controller/auth.js"; // Corrected path

const router = express.Router();

// User authentication routes
router.post("/signup", register); // Register user
router.post("/login", login); // Login user & return JWT
router.post("/refresh", refresh); // Refresh JWT token

export default router;
