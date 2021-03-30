import SocketContext from './socket-context';
import { BrowserRouter, Switch, Route, Redirect, useLocation } from "react-router-dom";

import React from "react";
import Home from './home';
import PostFull from './post-full';
import NavBar from './nav-bar';


let socket = io();

const App = (props) => {
    //const location = useLocation();
    //console.log(location);
    return (
    <BrowserRouter>
        <SocketContext.Provider value={socket}>
            
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/post/:pubkey/:id" component={PostFull}>
                    </Route>
                </Switch>
            
        </SocketContext.Provider>
    </BrowserRouter>)
    };
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);

socket.emit('connection');