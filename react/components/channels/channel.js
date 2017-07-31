import React from 'react';
import Chat from '../chat';

class Channel extends React.Component {
    constructor(props){
        super(props);

        console.log(this.props);

        console.log("in channel", this.props.match.params.id);


        this.state = {
            channel : {}
        };
    }

    render(){
        return (
            <div id="channel">
                <h3 className="ui dividing header">Welcome to <span className="ui green">Channel Name</span></h3>
                <Chat channelId={this.props.match.params.id}/>
            </div>
        );
    }
}

module.exports = Channel;