import io from 'socket.io-client';
const hostname = 'http://localhost:8000';
let socket = {};
let room = null;

module.exports = {
    index : {
		connect : function(){
			if(user){
				socket = io(hostname);
				setIdentity();
				socket.on('reconnect', () => setIdentity());
				return socket;
			}
			return false;
			function setIdentity(){
				if(user.twitch){
					socket.emit('set identity', {
						name : user.twitch.displayName,
						email : user.twitch.email,
						provider : "twitch",
						bio : user.twitch._json.bio,
						_id : user._id
					});
				} else {
					socket.emit('set identity', {
						name : "Anonymous",
						provider : "anonymous"
					});
				}
			}
		}
    },
    room : {
    	post : function(room, callback){
			$.ajax({
				method : "POST",
				url : "/channels",
				dataType : "json",
				data : room,
				success : callback,
				error : console.error
			});
		},
		get : function(id=null, callback){
    		let url = id ? '/channels/'+id : '/channels';
			$.ajax({
				method : "GET",
				url : url,
				dataType : "json",
				success : callback,
				error : console.error
			});
		},
		getMine : function(callback){
			$.ajax({
				method : "GET",
				url : '/users?fetch=rooms',
				dataType : "json",
				success : callback,
				error : console.error
			});
		},
		edit : function(id, room, callback){
			$.ajax({
				method : "PUT",
				url : "/channels/"+id,
				dataType : "json",
				data : room,
				success : callback,
				error : console.error
			});
		},
        joinRoom : function(roomId){
			if(room){
				socket.emit('leave room', room);
			}
            socket.emit('join room', roomId);
            room = roomId;
        },
		leaveRoom : function(){
        	if(room){
				socket.emit('leave room', room);
				room = null;
			}
		},
		undoOldRoomState : function(path){
			if(room && path !== `/channels/${room}`){
				console.log("Leaving room");
				socket.emit('leave room', room);
				room = null;
			}
		},
        onMessage : function(callback){
            socket.on('message', callback);
        },
        sendMessage : function(toRoomId, message){
            socket.emit('message', toRoomId, message);
        }
    }

};