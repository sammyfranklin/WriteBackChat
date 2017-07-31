import React from 'react';
import { Link } from 'react-router-dom';

class Channels extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            channels : [0,0,0,0,0,0,0,0]
        };
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
                <Link to={user ? `/channels/${i}` : '/login'} key={i} className="card">
                    <div className="image">
                        <img src="https://semantic-ui.com/images/wireframe/image.png"/>
                    </div>
                    <div className="content">
                        <div className="header">Channel name</div>
                        <div className="meta">Channel Id</div>
                        <div className="description">Channel Description</div>
                    </div>
                    <div className="extra content">
                        <span><i className="user icon red"/>75 Connected</span>
                    </div>
                </Link>
            );
        }
    }
}

module.exports = Channels;