const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Sender is required",
        ref: "User",
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Receiver is required",
        ref: "User",
    },
    message: {
        type: String,
        required: "Message is required",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Chat", chatSchema);