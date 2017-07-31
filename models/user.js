const mongoose = require('mongoose');

module.exports = mongoose.model("user", new mongoose.Schema({
    twitch : Object,
    online : Boolean,
	createdRooms : [{
    	type : String,
		ref : "channel"
	}],
    channels : [{
        type : String,
        ref : "channel"
    }],
    friends : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    accessToken : String,
    refreshToken : String
}, {
    timestamps : true
}));