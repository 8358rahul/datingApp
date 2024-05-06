const Chat = require('../models/Message');
const socketController = (io) => { 
  // connect
  io.on('connection', (socket) => { 
    // send message
    socket.on('send-message', async (data) => {
      try {
        const { senderId, receiverId, message } = data; 
        // save message to database
        const newMessage = new Chat({ senderId, receiverId, message });
        await newMessage.save();
        // send message to receiver 
        io.to(receiverId).emit('receive-message', newMessage);
      } catch (error) {
        console.log('catch error: ', error)
      } 
    })
  })
  // disconnect
  io.on('disconnect', () => {
    console.log('user disconnected');
  })

};

module.exports = socketController;