module.exports = {
    initialize : (server) => {

        let Server = require('socket.io');
        let io = new Server(server);
        let channelNSP = io.of('/channel');
        // friendNSP will handle friend-to-friend messaging
        //let friendNSP = io.of('/friend');
        let MessageStore = require('./messageStore');

        channelNSP.on('connection', function (socket) {
            /*
             Connection
             */
            console.log('User ' + socket.id + ' has connected!');
            socket.emit('message', "Global: Somebody has connected to a socket");

            /*
             Disconnection
             */
            socket.on('disconnect', function () {
                io.emit('message', "Global: Somebody has disconnected from a socket.");
            });

            /*
             Room Join
             */
            socket.on('room', function (room) {
                socket.join(room);
                socket.to(room).emit('message', 'Somebody has joined the channel!');
            });


            /*
             Messaging
             */

            //Room Messaging
            socket.on('message', function (msg, room) {
                //Send back to room and user
                socket.to(room).emit('message', msg);
                socket.emit('message', msg);
                let messageStruct = {
                    user: "Anonymous",
                    content: msg
                };
                MessageStore.send(messageStruct, room);
            });

            //Broadcast Messaging (into channels)
            socket.on('broadcast message', function (msg) {
                socket.broadcast.emit('message', msg);
                socket.emit('message', msg);
            });
        });
    }
};