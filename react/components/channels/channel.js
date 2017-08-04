import React from 'react';
import Chat from '../chat';
import { room as networking } from '../../networking';

class Channel extends React.Component {
    constructor(props){
        super(props);

        console.log(this.props);

        console.log("in channel", this.props.match.params.id);


        this.state = {};
        this.getChannel();
    }

    getChannel(){
    	let self = this;

    	let userChannels = user.channels || [];
    	console.log(userChannels);
		networking.get(this.props.match.params.id, (channel)=>{
			if(userChannels.includes(channel._id)) channel.saved = true;
			self.setState({
				channel : channel
			});
		});
	}
	toggleSaved(){
    	let self = this;
		networking.toggleSaved(user._id, this.state.channel._id, (isSaved)=>{
			console.log(isSaved);
			let channel = self.state.channel;
			channel.saved = isSaved;
			self.setState({
				channel : channel
			});
			console.log(channel);
		});
	}

    render(){
		let channel = this.state.channel;
		if(channel){
			return (
				<div id="channel">
					<div className="ui two column grid">
						<div className="column">
							<h3 className="ui dividing header">
								Welcome to <span className="ui green">{channel.name}</span>
							</h3>
						</div>
						<div className="column right aligned">
						<span onClick={()=>this.toggleSaved()} className="right floated clickable">
							<i className={`${!channel.saved ? "empty" : ""} star icon`}/>
						</span>
						</div>
					</div>

					<Chat channelId={this.props.match.params.id}/>
				</div>
			);
		}
		return (
			<div id="channel">
				<h1 className="ui header">Loading...</h1>
			</div>
		);

    }
}

module.exports = Channel;