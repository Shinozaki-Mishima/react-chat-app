import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

// upon entering site user will be greeted with the join component 
// which the user will then parse their data in the login form 
// and to query strings, we will pass that data through to the chat 
// once we have said data render then chat component 

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={Join} />
            <Route path="/chat" component={Chat} /> 
        </Router>
    )
}

export default App
