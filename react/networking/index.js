import io from 'socket.io-client';
const hostname = 'http://localhost:8000';
let socket = {};

module.exports = {
    index : {
		connect : function(){
			if(user){
				socket = io(hostname);
				if(user.twitch){
					socket.emit('set identity', {
						name : user.twitch.displayName,
						email : user.twitch.email,
						provider : "twitch",
						bio : user.twitch._json.bio
					});
				} else {
					socket.emit('set identity', {
						name : "Anonymous",
						provider : "anonymous"
					});
				}
				return socket;
			}
			return false;
		}
    },
    room : {

        joinChannel : function(roomId){
            socket.emit('room', roomId);
        },
        onMessage : function(callback){
            socket.on('message', callback);
        },
        sendMessage : function(toRoomId, message){
            socket.emit('message', toRoomId, message);
        }

    }

};