const Channel = require('../models/channel');
const MessagePage = require('../models/messagePage');
const globals = require('../globals');
const MAX_PAGE_LENGTH = 5;

class MessageStore {

    constructor(user, content){
        this.user = user;
        this.content = content;
        this.timeCreated = Date.now();
    }
    get toString(){
        return `${this.timeCreated} ${this.user}: ${this.content}`;
    }

    static send(message, toRoom){
        //Register messages into database
        Channel.findById(toRoom).populate('pageTail').exec(function(err, channel){
            if(globals.isError(err)) return err;
            console.log(`
                Message Store received message
                ${message.user}: ${message.content}
                in room ${toRoom}
            `);
            // Push as recent message
            channel.recentMessages.push(message);
            // If Page exceeds max length, then create a new page
            if(channel.pageTail.messages.length > MAX_PAGE_LENGTH - 1) {
                console.log("Creating a message page with this message.");
                MessagePage.create({
                    messages : [message]
                }, function(err, newPage){
                    if(globals.isError(err)) return err;
                    // Old page tail's next should refer to new page tail
                    channel.pageTail.next = newPage;
                    // Save Old page Tail
                    channel.pageTail.save();
                    // Channel's page tail should refer to new page tail
                    channel.pageTail = newPage;
                    // Save Channel
                    channel.save();
                });
            // Else, push into existing page
            } else {
                console.log("Pushing message into existing page");
                channel.pageTail.messages.push(message);
                // Save channel and its page tail
                channel.save();
                channel.pageTail.save();

            }
        });
    }
}

module.exports = MessageStore;