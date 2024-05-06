const User = require("../models/user");

const updateDesc = async (req, res) => {
  try {
    const { userId } = req.params;
    const { desc } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { desc: desc },
      { new: true }
    );
    if(!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User description updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating use description", error });
  }
};

module.exports = { updateDesc };
