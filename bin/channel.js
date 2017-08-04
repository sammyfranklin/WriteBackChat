const Channel = require('../models/channel');
const fault = require('../globals').fault;

class ChannelStore {
	constructor(){

	}

	static incrementNumConnected(id){
		this.getChannel(id, channel=>{
			channel.numConnected++;
			channel.save();
		});
	}

	static decrementNumConnected(id){
		this.getChannel(id, channel=>{
			channel.numConnected--;
			channel.save();
		});
	}

	static setNumConnected(id, value) {
		Channel.findByIdAndUpdate(id, {numConnected: value}).exec();
	}


	static getChannel(id, callback){
		Channel.findById(id, (err, channel)=>{
			if(!fault(err) && channel){
				callback(channel);
			}
		});
	}
}

module.exports = ChannelStore;