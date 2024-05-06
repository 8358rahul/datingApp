const User = require("../models/user");

const addLookingFor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { lookingFor: lookingFor },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Looking for updated successfully", user});
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};
const removeLookingFor = async(req, res) => {
    try {
        const { userId } = req.params;
        const { lookingFor } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { lookingFor: lookingFor },
            },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "Looking for remove successfully", user });
        
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
};
module.exports = { addLookingFor ,removeLookingFor};
