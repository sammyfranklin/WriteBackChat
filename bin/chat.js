let currentUsers = {};
const botty = {
    name : "Botty",
    age : Infinity
};
const MessageStore = require('./messageStore');
const ChannelStore = require('./channel');


module.exports = {
    initialize : (server) => {

        let io =  require('socket.io')(server);

		/*
		 Connection
		 */
        io.on('connection', function(socket){
            console.log(socket.id, "connected!");

            socket.on('set identity', (user={})=>{
                currentUsers[socket.id] = {
                	_id : user._id,
                	name : user.name,
					age : user.age,
					email : user.email,
					provider : user.provider,
					bio : user.bio
				};
                console.log("All users:", currentUsers);
            });

            /*
             Disconnection
             */
			socket.on('disconnecting', ()=>{
				console.log(socket.id, "disconnected!");
				let user = currentUsers[socket.id];
				if(user){
					delete currentUsers[socket.id];
					leaveAllRooms(user, true);
				}
			});

            /*
             Room Join
             */
            socket.on('join room', function (room) {
            	identify(user=>{
					console.log(socket.id, ' has joined ', room);
					socket.join(room);
					let data = {
						value : `${user.name} has joined the channel!`,
						date : new Date(Date.now())
					};
					ChannelStore.incrementNumConnected(room);
					io.to(room).emit('message', data, botty);
				});

			});

			/*
			 Room Leave
			 */
			socket.on('leave room', (room)=>{
				identify(user=>{
					console.log(socket.id, ' has left ', room);
					socket.leave(room);
					let data = {
						value : `${user.name} has left the channel!`,
						date : new Date(Date.now())
					};
					ChannelStore.decrementNumConnected(room);
					io.to(room).emit('message', data, botty);
				});
			});

			socket.on('leave all rooms', ()=>{
				identify(user => {
					leaveAllRooms(user, false);
				});
			});


            /*
             Messaging
             */

            //Room Messaging
            socket.on('message', function (toRoomId, msg) {
                identify(user=>{
					let data = {
						value : msg,
						date : new Date(Date.now())
					};
					io.to(toRoomId).emit('message', data, user);
					if(user.provider !== 'anonymous') MessageStore.send(data, user, toRoomId);
					console.log(socket.rooms);
				});

			});


			function identify(callback){
				let user = currentUsers[socket.id];
				if(user) callback(user);
				else {
					socket.emit('error', 'Not Identified');
				}
			}
			function leaveAllRooms(user, isDisconnecting){
				let data = {
					value : `${user.name} has left the channel!`,
					date : new Date(Date.now())
				};
				Object.keys(socket.rooms).forEach(room => {
					if(room !== socket.id) {
						io.to(room).emit('message', data, botty);
						ChannelStore.decrementNumConnected(room);
						if(!isDisconnecting) socket.leave(room);
					}
				});
			}
        });
    }
};

