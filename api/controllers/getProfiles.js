const user = require("../models/user");

const getProfiles = async (req, res) => {
    const { userId, gender, turnOns, lookingFor } = req.query; 
    try {
      let filter = { gender: gender == "male" ? "female" : "male" };  
      if(turnOns) filter.turnOns = { $in: turnOns };
        if(lookingFor) filter.lookingFor = { $in: lookingFor }; 
   
      const profiles = await user.findById(userId)
        .populate("matches", "_id")
        .populate("crushes", "_id"); 
  
      // Extract IDs of friends
      const matches = profiles.matches.map((match) => match._id);
  
      // Extract IDs of crushes
      const crushes = profiles.crushes.map((crush) => crush._id);
  
      const data = await user.find({...filter})
        .where("_id")
        .nin([userId, ...matches, ...crushes]);
  
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching profiles", error });
    }
};

const sendLike = async (req, res) => {
    try {
        const {currentID,selectedId} = req.body;
        await user.findByIdAndUpdate(selectedId,{
            $push:{receivedLikes:currentID}
        },{new:true});
        await user.findByIdAndUpdate(currentID,{
            $push:{crushes:selectedId}
        },{new:true});
        res.status(200).json({message:"Like sent successfully"});
        
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
};
module.exports = { getProfiles,sendLike };