const User = require("../models/user");

const addTurnOns = async (req, res) => {
    try {
        const { userId } = req.params;
        const { turnOns } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet :{turnOns: turnOns} },
            { new: true }
        );
        if(!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User turn on update succesfully", user });
        
    } catch (error) {
        res.status(500).send({ message: "Internal server error",error });
    }

};

const removeTurnOns = async (req, res) => {
    try {
        const { userId } = req.params;
        const { turnOns } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull :{turnOns: turnOns} },
            { new: true }
        );
        if(!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User turn on remove succesfully", user });
        
    } catch (error) {
        res.status(500).send({ message: "Error removing turn on",error });
    }
};

module.exports = { addTurnOns ,removeTurnOns};