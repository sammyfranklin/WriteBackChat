import React from 'react';

class Account extends React.Component {
	constructor(props){
		super(props);
	}

	addChatRoom(){

	}
	render(){
		return (
			<div className="ui text container center aligned">
				<h2 className="ui icon header">
					<i className="user icon"/>
					<div className="content">
						{user.twitch.displayName}
						<div className="sub header">Welcome to your account settings.</div>
					</div>
				</h2>
				<div className="ui segment">
					<button onClick={()=>this.addChatRoom()} className="fluid button ui">Create a chat room</button>
				</div>
			</div>
		);
	}
}

module.exports = Account;