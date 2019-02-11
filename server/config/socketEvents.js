// exports = module.exports = function(io) {  
//   // Set socket.io listeners.
//   io.on('connection', (socket) => {
//     console.log('a user connected');

//     // On conversation entry, join broadcast channel
//     socket.on('enter conversation', (conversation) => {
//       socket.join(conversation);
//       console.log('joined ' + conversation);
//     });

//     socket.on('leave conversation', (conversation) => {
//       socket.leave(conversation);
//      console.log('left ' + conversation);
//     })

//     socket.on('new-message', (message) => {
//       //io.sockets.in(conversation).emit('refresh messages', conversation);
//       console.log(message)
//       io.emit('message', {type:'message', text: message});    
//       });

//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
// }