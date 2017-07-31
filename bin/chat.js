let currentUsers = {};
const botty = {
    name : "Botty",
    age : Infinity
};


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
                	name : user.name,
					age : user.age,
					email : user.email,
					provider : user.provider,
					bio : user.bio,
					rooms : user.rooms || []
				};
                console.log("All users:", currentUsers);
            });

            /*
             Disconnection
             */
			socket.on('disconnect', ()=>{
				console.log(socket.id, "disconnected!");
				delete currentUsers[socket.id];
				console.log(currentUsers);
			});

            /*
             Room Join
             */
            socket.on('room', function (room) {
				let user = currentUsers[socket.id];
				console.log(socket.id, ' has joined ', room);
                socket.join(room);
                user.rooms.push(room);
                let data = {
                    value : `${user.name} has joined the channel!`,
                    date : new Date(Date.now())
                };
                io.to(room).emit('message', data, botty);
                console.log(currentUsers);
            });


            /*
             Messaging
             */

            //Room Messaging
            socket.on('message', function (toRoomId, msg) {
                //Send back to room and user
                let data = {
                    value : msg,
                    date : new Date(Date.now())
                };
                io.to(toRoomId).emit('message', data, currentUsers[socket.id]);
            });


        });
    }
};