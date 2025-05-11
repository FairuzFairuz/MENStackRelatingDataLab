import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username"); // Fetch only usernames
    res.status(200).json({ users });
  } catch (error) {
    console.error("User List Retrieval Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPantry = async (req, res) => {
    try {
      const { userId } = req.params;
  
      console.log("Retrieving pantry for user:", userId); // ✅ Debugging step
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ username: user.username, foodPantry: user.foodPantry });
    } catch (error) {
      console.error("Pantry Retrieval Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
