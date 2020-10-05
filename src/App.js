import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import Login from './login/Login'
import SignUp from './signup/SignUp'
import Dashboard from './dashboard/Dashboard'

function App(props) {
    return (
        <Router>
            <div id="routing-container">
                <Route path="/login" exact component={Login} />
                <Route path="/signup" exact component={SignUp} />
                <Route path="/dashboard" exact component={Dashboard} />
            </div>
        </Router>
    );
}

export default App;