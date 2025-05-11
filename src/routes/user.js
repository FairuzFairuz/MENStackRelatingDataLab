import express from "express";
import { getAllUsers, getUserPantry } from "../controller/user.js";

const router = express.Router();

router.get("/users", getAllUsers); // Get all users
router.get("/users/:userId/pantry", getUserPantry);

export default router;
