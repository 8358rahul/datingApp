const Chat = require('../models/Message');

const socketConnection = (socket) => {
  console.log('socket', socket)
    console.log('a user connected'); 
    // send message
    socket.on('send-message', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        console.log('message: ', message)
        // save message to database
        const newMessage = new Chat({ senderId,  receiverId, message });
        await newMessage.save();
        // send message to receiver 
        io.to(receiverId).emit('receive-message', newMessage);
      } catch (error) {
        console.log('catch error: ', error)
      }   
  
    }) 
    // socket disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });  
  };

module.exports = socketConnection;