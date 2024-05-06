const User = require("../models/user");

const getUserData = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if(!user) return res.status(404).send({ message: "User not found" });
        res.status(200).send({ message: "User found", user });
        
    } catch (error) {
        res.status(500).send({ message: "Internal server error",error });
    }
};

module.exports = { getUserData };