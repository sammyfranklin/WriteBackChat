import React from 'react';
import { index as networking } from '../networking';

class Login extends React.Component {
    constructor(props){
        super(props);
    }

    goAnonymous(){
    	user = {
    		type : "Anonymous"
		};
    	networking.connect();
		this.props.history.push('/');
	}

    render(){
        return (
            <div className="ui text container center aligned">
                <div className="ui grid">

                    <div className="row">
                        <div className="column">
                            <h2 className="ui icon header">
                                <i className="sign in icon"/>
                                <div className="content">
                                    Login
                                    <div className="sub header">After logging in, you may use the chat service</div>
                                </div>
                            </h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column">
                            <a href="/auth/twitch" className="ui fluid button purple"><i className="twitch icon"/> Login with Twitch</a>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column">
                            <button onClick={()=>this.goAnonymous()} className="ui fluid button">Login anonymously</button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

module.exports = Login;