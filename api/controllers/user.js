const sendVerificationEmail = require("./sendEmail");
const User = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken"); 

const register = async(req, res) => {
  try {
    const { email, name, password } = req.body;

    // check if email is already registered 
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({message: "User already exists"}) 
    } 
    // create a new user
    const newUser = new User({email, name, password });

    // generate a verification token
    newUser.verificationToken = crypto.randomBytes(16).toString("hex");

    // save the user to the backend
    await newUser.save();

    // send a verification email
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.status(200).json({message: "User registered successfully"});
 
    }catch (err) { 
    res.status(500).json({ message: "Registration failed",err });
    }
};
 

const login = async(req, res) => {
  const secretKey =  crypto.randomBytes(16).toString("hex");
  try {
    const { email, password } = req.body; 
    // check if the user exists
    const user = await User.findOne({email});
    if(!user){  
        return res.status(400).json({message: "User does not exist"});
    }
    // check if the password is correct
    if(user.password !== password){
        return res.status(400).json({message: "Invalid password"});
    }

    const token = jwt.sign({userId:user._id}, secretKey, {expiresIn: "1h"});
    return res.status(200).json({message: "User logged in successfully", token});
    
  } catch (error) {
    res.status(500).json({ message: "Login failed",error });
  }
};


const verifyGender = async(req, res) => { 
  try {
    const {userId} = req.params;
    const {gender} = req.body;  
    const user = await User.findByIdAndUpdate(userId,{gender:gender},{new:true});
    console.log(user)
    if(!user){
        return res.status(400).json({message: "User does not exist"});
    }
    res.status(200).json({message: "User gender updated Successfully", user});
  } catch (error) {
    res.status(500).json({ message: "Verification failed",error });
  }
};

module.exports = { register,login,verifyGender };
