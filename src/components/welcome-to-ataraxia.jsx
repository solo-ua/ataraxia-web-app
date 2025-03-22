import React, {useState} from 'react';
import Login from './minor-components/login';
import Signup from './minor-components/signup';
import '../style/main.css';

const WelcomeToAtaraxia = () => {
    const [flipped, setFlipped] = useState(true);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <div className='body-startup'>
            <h1 className='ataraxia-startup'>ATARAXIA</h1>
            <div className="container-startup">
                <div className={`card ${flipped ? 'flipped' : ''}`}>
                    <div className="front">
                        <Login />
                    </div>
                    <div className="back">
                        <Signup />
                    </div>
                </div>
                <button className='flip' onClick={handleFlip}>
                    {flipped ? 'Login' : "Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default WelcomeToAtaraxia;
