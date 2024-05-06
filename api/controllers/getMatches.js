const User = require("../models/user");


const receivedLikesDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const receivedLiked = [];
        for (const liked of user.receivedLikes) { 
            const likedUser = await User.findById(liked);
            if (likedUser) {
                receivedLiked.push(likedUser);
            }
        }
        res.status(200).json(receivedLiked);
        
    } catch (error) {
        res.status(500).send({ message: "Internal server error",error });
    }
};

const createMatch = async (req, res) => {
    try {
        const { currentID, selectedId } = req.body; 
        // update the selected user's crushes array and matches array
        await User.findByIdAndUpdate(selectedId, {
            $push: { matches: currentID },
            $pull: { crushes: currentID },
        });
        // update the current user's matches array and receivedLikes array
        await User.findByIdAndUpdate(currentID, {
            $push: { matches: selectedId },
            $pull: { receivedLikes: selectedId },
        });

        res.status(200).json({ message: "Match created" });

        
    } catch (error) {
        res.status(500).send({ message: "Internal server error",error });
    }
};

const getMatches = async (req,res)=>{
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const matchIds = user.matches;
        const matches = await User.find({ _id: { $in: matchIds } }); 
        res.status(200).json(matches);

    } catch (error) {
        res.status(500).send({ message: "Internal server error",error });
    }
}



module.exports = { receivedLikesDetails,createMatch,getMatches };