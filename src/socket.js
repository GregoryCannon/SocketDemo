var socketIo = require('socket.io');

const socketConfig = (server) => {
  var io = socketIo.listen(server);

  var connections = [];
  var ids = [];
  var users = {};

  io.sockets.on('connection', function(socket){
    connections.push(socket)

    socket.on('client.ping', function() {
      io.sockets.emit('server.pong');
      sendRoomMessage('%usr% has pinged the server!')
    });

    socket.on('client.requestId', function() {
      const newId = ('000' + (ids.length + 1)).slice(-3);
      ids.push(newId);
      socket._id = newId;
      socket.emit('server.newId', newId);
    })

    socket.on('client.joinRoom', function(room) {
      if (!users[room]) users[room] = [];
      users[room].push(socket._id);
      socket._room = room;
      socket.join(room);
      sendRoomMessage('%usr% has joined %room%');
      sendRoomMembers();
    })

    socket.on('disconnect', function() {    // When user disconnects
      connections.splice(connections.indexOf(socket), 1);
      Object.keys(users).forEach(function(room){
        users[room] = users[room].filter(u => u != socket._id);
        sendRoomMessage('%usr% has left %room%');
        sendRoomMembers();
      })
      socket.disconnect;
    });

    const sendRoomMessage = (message) => {
      message = message.replace(/%usr%/, 'User ' + socket._id);
      message = message.replace(/%room%/, 'room ' + socket._room);
      io.sockets.in(socket._room).emit('server.roomMessage', message);
    }
    const sendRoomMembers = () => {
      io.sockets.in(socket._room).emit('server.roomMembers', users[socket._room]);
    }
  });
}

module.exports = socketConfig;
