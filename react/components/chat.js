import React from 'react';
import { room as networking } from '../networking';

class Chat extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            messages : [],
            messageEntry : ""
        };

        this.setUpNetworking();
    }

    componentDidMount(){
        let self = this;
        $('#message-entry-input').keypress((evt)=>{
            if(evt.which === 13){
                self.sendMessage();
            }
        });
    }
    setUpNetworking(){
        console.log("Joined channel Id", this.props.channelId);
        networking.joinChannel(this.props.channelId);
        let self = this;
        networking.onMessage((message, user)=>{
            self.setState({
                messages : [...self.state.messages, {
                    content : message,
                    user : user
                }]
            });
            let messages = document.getElementById("messages");
            messages.scrollTop = messages.scrollHeight;
        });

    }

    sendMessage(){
        console.log("sending message:", this.state.messageEntry);
        networking.sendMessage(this.props.channelId, this.state.messageEntry);
        this.setState({
            messageEntry : ""
        });
    }

    render (){
        let self = this;
        return (
            <div id="chat">
                <div id="messages" className="ui segment">
                    <div className="ui comments">
                        {this.state.messages.map(eachMessage)}
                    </div>
                </div>
                <div id="message-entry" className="ui fluid action input">
                    <input type="text" value={this.state.messageEntry} id="message-entry-input" placeholder="Type here..." onChange={messageEntryChange}/>
                    <button className="ui button labeled icon" onClick={()=>this.sendMessage()}>
                        Send <i className="ui send icon"/>
                    </button>
                </div>
            </div>
        );

        function messageEntryChange(evt){
            self.setState({
                messageEntry : evt.currentTarget.value
            });
            console.log("Message Entry:", self.state.messageEntry);
        }

        function eachMessage(msg, i){
            return (
                <div key={i} className="comment">
                    <a className="avatar">
                        <img src="https://semantic-ui.com/images/wireframe/image.png"/>
                    </a>
                    <div className="content">
                        <a className="author">{msg.user.name}</a>
                        <div className="metadata">
                            <span className="date">{(new Date(msg.content.date)).toLocaleTimeString()}</span>
                        </div>
                        <div className="text">
                            {msg.content.value}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

module.exports = Chat;