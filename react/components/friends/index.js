import React from 'react';
import {Route, Link} from 'react-router-dom';

class Friends extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="ui container">
                Welcome to Friends
            </div>
        );

    }
}

module.exports = Friends;