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
    messages : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'page'
    },
    members : [String]
},
{
    timestamps : true
});

module.exports = mongoose.model("channel", ChannelSchema);