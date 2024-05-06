require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { register, login, verifyGender } = require("./controllers/user");
const { verifyEmail } = require("./controllers/verifyEmail");
const { updateDesc } = require("./controllers/updateDesc");
const { getUserData } = require("./controllers/getUserData");
const { addTurnOns, removeTurnOns } = require("./controllers/addTurnOns");
const { addLookingFor, removeLookingFor } = require("./controllers/addLookingFor");
const { uploadProfileImages, removeProfileImages } = require("./controllers/uploadProfileImages");
const { getProfiles, sendLike } = require("./controllers/getProfiles");
const fileUpload = require('express-fileupload');
const { getMatches, createMatch, receivedLikesDetails } = require("./controllers/getMatches"); 
const {getMessages,deleteMessages} = require("./controllers/getMessages");
const socketController = require("./controllers/socketController"); 

const app = express();

// socket io
const http = require('http').createServer(app);
const io = require('socket.io')(http);  

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// listen to backend server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// listen to socket server
http.listen(8000, () => {
  console.log('listening on *:8000');
});

//api endpoints 
app.post("/register", register)
app.get("/verify-email/:token", verifyEmail)
app.post("/login", login)
app.put("/users/:userId/gender", verifyGender)
app.put("/users/:userId/desc", updateDesc)
app.get("/users/:userId", getUserData)
app.put("/users/:userId/turn-ons/add", addTurnOns)
app.put("/users/:userId/turn-ons/remove", removeTurnOns)
app.put("/users/:userId/looking-for/add", addLookingFor)
app.put("/users/:userId/looking-for/remove", removeLookingFor)
app.post("/users/:userId/profile-images", uploadProfileImages)
app.put("/users/:userId/profile-images/remove", removeProfileImages)
app.get("/profiles", getProfiles);
app.post("/send-like", sendLike)
app.get("/received-likes/:userId/details", receivedLikesDetails)
app.get("/users/:userId/matches", getMatches)
app.post("/create-match", createMatch) 

// socket io endpoints
socketController(io);
app.get("/messages", getMessages)
app.delete("/delete",  deleteMessages)
