import express from "express";
import {
  addFoodItem,
  deletePantryItem,
  getPantryItems,
  updatePantryItem,
} from "../controller/food.js";
import { isSignedIn } from "../middleware/is-signed-in.js";

const router = express.Router();

router.post("/foods", isSignedIn, addFoodItem);
router.get("/users/:userId/pantry", isSignedIn, getPantryItems);
router.put("/users/:userId/pantry/:itemId", isSignedIn, updatePantryItem);
router.delete("/users/:userId/pantry/:itemId", isSignedIn, deletePantryItem);

export default router;
