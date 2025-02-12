const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "non-binary"],
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  crushes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  receivedLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profileImages: [
    {
      type: String,
      default: [],
    },
  ],
  desc: {
    type: String,
    default: "",
  },
  turnOns: [{
     type: String,
     default:[],
    }],
  lookingFor: [
    {
      type: String,
      default:[],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
