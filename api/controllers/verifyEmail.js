const User = require("../models/user");

const verifyEmail = async (req, res) => { 
  try {
    const  token  = req?.params?.token;  
    // find the user with the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    // update the user's emailVerified field to true
    user.emailVerified = true;
    user.verificationToken = "";
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.log("Error verifying the email", err);
    res.status(500).json({ message: "Verification failed" });
  }
}; 

module.exports = { verifyEmail };
