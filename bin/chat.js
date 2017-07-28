module.exports = {
    initialize : (server) => {

        let Server = require('socket.io');
        let io = new Server(server);
        let channelNSP = io.of('/channel');

        let MessageStore = require('./messageStore');
        let currentUsers = {};

        io.on('connection', function(socket){
            console.log('User ' + socket.id + ' has connected to the root NSP!');

            socket.on('set identity', (user)=>{
                currentUsers[socket.id] = user;
            });

            socket.on('message', (toId, msg)=>{
                socket.to(toId).emit('message', {
                    user : socket._user,
                    message : msg
                });
            });

            socket.on('disconnect', ()=>{
                delete currentUsers[socket.id];
            });
        });

        channelNSP.on('connection', function (socket) {
            /*
             Connection
             */
            console.log('User ' + socket.id + ' has connected to the channel NSP!');

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
                channelNSP.to(room).emit('message', 'Somebody has joined the channel!');
            });


            /*
             Messaging
             */

            //Room Messaging
            socket.on('message', function (toRoomId, msg) {
                //Send back to room and user
                channelNSP.to(toRoomId).emit('message', msg);
                /*
                let messageStruct = {
                    user: "Anonymous",
                    content: msg
                };
                MessageStore.send(messageStruct, room);
                */
            });

            //Broadcast Messaging (into channels)
            socket.on('broadcast message', function (msg) {
                channelNSP.emit('message', msg);
            });
        });
    }
};