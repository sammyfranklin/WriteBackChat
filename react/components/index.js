import React from 'react';
import {Route, Link} from 'react-router-dom';
import Channels from './channels';
import Channel from './channels/channel';
import Friends from './friends';
import Login from './login';
import Account from './account';
import networking from '../networking';

class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        networking.index.connect();
    }

    componentDidMount(){
        console.log("USER:", user);
    }
    componentDidUpdate(){
        console.log(this.props.location.pathname);
        networking.room.undoOldRoomState(this.props.location.pathname);
    }

    render(){
        let self = this;
        return (
            <div id="index">

                <div id="left-nav" className="ui visible vertical inverted sidebar menu">
					{(
						user && user.twitch &&
						<Link to="/account" className="item">
							<div className="header">
								<img src="https://semantic-ui.com/images/wireframe/image.png" className="ui avatar image"/> {user.twitch.displayName}
							</div>
						</Link>
					) || (
						user &&
						<div className="item">
							<div className="header">
								<i className="ui spy icon"/> Anonymous
							</div>
						</div>
					) || (
						<Link to="/login" className="item">
							<div className="header">
								<i className="sign in icon"/> Sign In
							</div>
						</Link>
					)}
                    <div className="item">
                        <div className="header">Search</div>
                        <div className="ui icon transparent fluid inverted input">
                            <input type="text" placeholder="Search..."/><i className="search icon"/>
                        </div>
                    </div>
                    <div className="item">
                        <div className="header">Saved Channels</div>
                        <div className="menu">
                            {
                                user && user.twitch
                                    ?
                                    (user.channels.length === 0 && <Link to="/channels" className="item">None added yet!</Link>) ||
                                    (user.channels.map(eachChannel))
                                    :
                                    <Link to="/login" className="item">Sign in with Twitch first!</Link>
                            }
                        </div>
                    </div>
                    <div className="item">
                        <div className="header">Friends</div>
                        <div className="menu">
                            {
                                user && user.twitch
                                    ?
                                    (user.friends.length === 0 && <div className="item">None added yet!</div>) ||
                                    (user.friends.map(eachFriend))
                                    :
                                    <Link to="/login" className="item">Sign in with Twitch first!</Link>
                            }
                        </div>
                    </div>
                </div>


                <div className="" id="page-content">
                    <Route exact path="/" render={routeProps=><Channels {...routeProps}/>}/>
                    <Route exact path="/channels" render={routeProps=><Channels {...routeProps}/>}/>
					{
						user &&
						<Route exact path="/channels/:id" render={routeProps=><Channel {...routeProps}/>}/>
					}
					{
						user && user.twitch && (
							<div>
								<Route exact path="/friends" render={routeProps=><Friends {...routeProps}/>}/>
								<Route exact path="/account" component={Account}/>
							</div>
						)
					}
					<Route exact path="/login" render={routeProps=><Login {...routeProps}/>}/>
				</div>
            </div>
        );
        function eachChannel(channel, i){
            let isLocation = self.props.location.pathname === "/channels/"+i;
            return (
                <Link key={i} to={`/channels/${i}`} className={`${isLocation && "active"} item`}>Channel {i}</Link>
            );
        }
        function eachFriend(friend, i){
            let isLocation = self.props.location.pathname === "/friends/"+i;
            return (
                <Link key={i} to={`/friends/${i}`} className={`${isLocation && "active"} item`}>Friend {i}</Link>
            );
        }
    }
}

module.exports = Index;