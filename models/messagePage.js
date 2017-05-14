const mongoose = require('mongoose');

const messagePageSchema = new mongoose.Schema({
    messages : [{
        user : String,
        content : String
    }],
    next : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messagePage'
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('messagePage', messagePageSchema);