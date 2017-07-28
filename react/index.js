import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import App from './components';

document.addEventListener("DOMContentLoaded", ()=> {
    console.info("chat v0.0.1");
    ReactDOM.render(
        <HashRouter>
            <Route path="/" render={routeProps=><App {...routeProps}/>}/>
        </HashRouter>, document.getElementById("app")
    );
});