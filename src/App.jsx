import React from 'react';
import { Provider } from 'react-redux'; // Import the Provider
import Startup from './components/startup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeToAtaraxia from './components/welcome-to-ataraxia';
import Home from './components/home-page';
import { Store } from './redux/store';
import Radio from './components/minor-components/radio';
import Servers from './components/servers'
import Search from './components/search-people';
import Profile from './components/profile';
import View_Profile from './components/minor-components/userProfile-view';
import Settings from './components/settings';
// ASK IF THIS IS CORRECT FILE FORM

const App = () => {
    return (
        <Provider store={Store}>
            <Router>
                <Routes>
                    <Route path="/" element={<Startup />} />
                    <Route path="/Ataraxia" element={<WelcomeToAtaraxia />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/me" element={<Profile />} />
                    <Route path="/servers" element={<Servers />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/Ataraxia-Enjoyer/:username" element={<View_Profile />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
