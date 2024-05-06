const User = require("../models/user");   
const fs = require("fs");


const uploadProfileImages = async (req, res) => {   
    try {
      const { userId } = req.params;
      const { file } = req.files;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Please upload a file" });
      }  
      // generaete reandom file name
      const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const fileName =  random + file.name; 
      file.mv("./uploads/" +fileName , async (err) => {
        if (err) {
          console.log("Error uploading file", err);
        } else {
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }  
          const filePath = "/uploads/" +   fileName;
          user.profileImages.push(filePath);
          await user.save();  
          res.status(200).json({ message: "File uploaded successfully" , filePath});
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
 
};

const removeProfileImages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileImages } = req.body;
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $pull: { profileImages: profileImages },
        },
        { new: true }
    );
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    } 
    fs.unlink("." + profileImages, (err) => {
        if (err) {
            console.log("Error deleting file", err);
        } else {
            console.log("File deleted");
        }
    });
    res.status(200).send({ message: "Image remove successfully", user });
    
} catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
}
};

module.exports = { uploadProfileImages ,removeProfileImages};
