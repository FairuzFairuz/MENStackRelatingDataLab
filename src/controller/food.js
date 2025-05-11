import User from "../models/User.js";

export const addFoodItem = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Food name is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.foodPantry.push({ name });
    await user.save();
    res
      .status(201)
      .json({ message: "Food item addded succesfully", food: name });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//get pantry's items by user
export const getPantryItems = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from route params

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ username: user.username, foodPantry: user.foodPantry });
  } catch (error) {
    console.error("Pantry Retrieval Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//update pantry item based in userID
export const updatePantryItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { name } = req.body;

    console.log("Updating pantry item:", userId, itemId, name); // Debugging step

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const item = user.foodPantry.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Pantry item not found" });
    }

    item.name = name; // Update item name
    await user.save();

    res
      .status(200)
      .json({ message: "Pantry item updated successfully", food: item });
  } catch (error) {
    console.error("Pantry Update Error:", error); // Log full error for debugging
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

//delete pantry item
export const deletePantryItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    console.log("Deleting pantry item:", userId, itemId); // Debugging step

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const itemIndex = user.foodPantry.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Pantry item not found" });
    }

    user.foodPantry.splice(itemIndex, 1); // Remove item from array
    await user.save();

    res.status(200).json({ message: "Pantry item deleted successfully" });
  } catch (error) {
    console.error("Pantry Deletion Error:", error); // Log full error for debugging
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
