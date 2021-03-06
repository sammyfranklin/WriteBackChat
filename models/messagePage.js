const mongoose = require('mongoose');

const messagePageSchema = new mongoose.Schema({
    messages : [{
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        content : {
            value : String,
            date : Date
        }
    }],
    previous : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'messagePage'
    },
    next : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messagePage'
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('messagePage', messagePageSchema);