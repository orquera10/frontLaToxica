import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Calendar from './components/Calendar';
import Login from './components/Login'; // Asumiendo que tienes un componente Login

function App() {
    return (
        <div className="App">
            <Router>
                <Route path="/" exact component={Calendar} />
                <Route path="/login" component={Login} />
            </Router>
        </div>
    );
}

export default App;

