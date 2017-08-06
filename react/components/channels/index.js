import React from 'react';
import { Link } from 'react-router-dom';
import { room as networking } from '../../networking';

class Channels extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            channels : []
        };
        this.getChannels();
    }

    getChannels(){
    	let self = this;
    	networking.get(null, (data)=>{

    		if(user && user.twitch){
				data.forEach((channel, i) => {
					console.log(channel._id);
					let target = user.channels.indexOf(channel._id);
					console.log(target);
					data[i].saved = target !== -1;
				});
			}

    		self.setState({
    			channels : data
			});
    		console.log(data);
		});
	}

    render(){
        return (
            <div id="channels" className="ui container">
                <div className="ui link cards">
                    {this.state.channels.map(eachChannel)}
                </div>
            </div>
        );
        function eachChannel(channel, i){
            return (
                <Link to={user ? `/channels/${channel._id}` : '/login'} key={i} className="card">
                    <div className="image">
                        <img src="https://semantic-ui.com/images/wireframe/image.png"/>
                    </div>
                    <div className="content">
                        <div className="header">{channel.name}</div>
                        <div className="meta">{channel._id}</div>
                        <div className="description">{channel.description}</div>
                    </div>
                    <div className="extra content">
                        <span><i className="user icon red"/>{channel.numConnected || 0} Connected</span>
						<span className="right floated">
							<i className={`${!channel.saved ? "empty" : ""} star icon`}/>
						</span>
                    </div>
                </Link>
            );
        }
    }
}

module.exports = Channels;