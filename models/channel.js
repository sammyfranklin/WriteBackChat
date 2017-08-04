const mongoose = require('mongoose');
const shortid = require('shortid');

const ChannelSchema = new mongoose.Schema({
    _id :{
        type : String,
        default : shortid.generate
    },
    name : String,
    description : String,
    recentMessages : [{
        user : String,
        content : String
    }],
    pageHead : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'messagePage'
    },
    pageTail : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'messagePage'
    },
    members : [String],
    numConnected : {
        type : Number,
		default : 0
    }
},
{
    timestamps : true
});

module.exports = mongoose.model("channel", ChannelSchema);