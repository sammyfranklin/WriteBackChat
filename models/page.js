const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    messages : {
        user : String,
        content : String
    },
    next : {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'page'
        },
        default : null
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('page', PageSchema);