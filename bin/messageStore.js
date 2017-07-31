const Channel = require('../models/channel');
const MessagePage = require('../models/messagePage');
const fault = require('../globals').fault;
const MAX_PAGE_LENGTH = 5;


class MessageStore {

    constructor(){
		this.messagesStoredThisSession = 0;
    }

    get toString(){
        return `MessageStore (Messages sent in this session = ${this.messagesStoredThisSession}`;
    }

    static send(message, user, toRoom){
    	this.messagesStoredThisSession++;
    	console.log("Message:", message);
    	console.log("toRoom:", toRoom);

        //Register messages into database
        Channel.findById(toRoom).populate('pageTail').exec(function(err, channel){
            if(fault(err)) return false;
            // Push as recent message
            //channel.recentMessages.push(message);
            // If Page exceeds max length, then create a new page
			let post = {
				author : user._id,
				content : message
			};
            if(channel.pageTail.messages.length > MAX_PAGE_LENGTH - 1) {
                console.log("Creating a message page with this message.");
                MessagePage.create({
                    messages : [post]
                }, (err, newPage)=>{
                    if(fault(err)) return false;
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
                channel.pageTail.messages.push(post);
                // Save channel and its page tail
                //channel.save();
                channel.pageTail.save();

            }

        });
    }
}

module.exports = MessageStore;