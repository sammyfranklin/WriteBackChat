import React from 'react';
import { Link } from 'react-router-dom';
import { index as networking } from '../networking';

class Account extends React.Component {
	constructor(props){
		super(props);
		console.log("in account");
		this.state = {
			room : {},
			createdRooms : user.createdRooms || [],
			user : {}
		};
		this.getChatRooms();
	}
	componentDidMount(){
		$('.ui.modal').modal();
	}
	getChatRooms(){
		let self = this;
		networking.getMe((data)=>{
			self.setState({
				createdRooms : data.createdRooms,
				user : data
			});
		});
	}

	chatRoomChange(property, evt){
		let room = this.state.room;
		room[property] = evt.currentTarget.value;
		this.setState({
			room : room
		});
	}
	submitChatRoom(){
		let self = this;
		networking.post(this.state.room, data=>{
			console.log(data);
			let rooms = self.state.createdRooms;
			rooms.push(data);
			self.setState({
				createdRooms : rooms
			});
		});
	}
	render(){
		return (
			<div className="ui text container">
				<h2 className="ui icon header center aligned">
					<i className="user icon"/>
					<div className="content">
						{user.twitch.displayName}
						<div className="sub header">Welcome to your account settings.</div>
					</div>
				</h2>
				<div className="ui segment">
					<button onClick={()=>$('#room-modal').modal('show')} className="fluid button ui">Create a chat room</button>
					{
						this.state.createdRooms && this.state.createdRooms.length > 0 &&
						<div>
							<div className="ui divider"/>
							<div className="ui items">
								{this.state.createdRooms.map(eachChatRoom)}
							</div>
						</div>

					}
				</div>
				<div id="room-modal" className="ui modal">
					<h3 className="header">Room</h3>
					<div className="content">
						<div className="ui form">
							<div className="field">
								<label htmlFor="name">Name</label>
								<input type="text" id="name" onChange={(evt)=>this.chatRoomChange("name", evt)}/>
							</div>
							<div className="field">
								<label htmlFor="description">Description</label>
								<input type="text" id="description" onChange={(evt)=>this.chatRoomChange("description", evt)}/>
							</div>
						</div>
					</div>
					<div className="actions">
						<button className="ui button labeled basic blue icon" onClick={()=>this.submitChatRoom()}><i className="checkmark icon"/> Done</button>
					</div>
				</div>
			</div>
		);
		function eachChatRoom(room, i){
			return (
				<div key={i} className="item">
					<div className="content">
						<div className="header">{room.name}</div>
						<div className="meta">{room._id}</div>
						<div className="description">{room.description}</div>
						<div className="extra">
							<Link to={`/channels/${room._id}`} className="ui right floated basic button">
								Go To <i className="right chevron icon"/>
							</Link>
						</div>
					</div>
				</div>
			);
		}
	}
}

module.exports = Account;