const Chat = require("../models/Message");

const getMessages = async (req, res) => {
    try {
        const {senderId, receiverId} = req.query; 
        const messages = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).populate("senderId", "_id name");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
const deleteMessages = async (req, res) => {
    try { 
        const { messageIds } = req.body;
        const messages = await Chat.deleteMany({ _id: { $in: messageIds } });
        res.status(200).json(messages); 
      
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
module.exports = {getMessages,deleteMessages};