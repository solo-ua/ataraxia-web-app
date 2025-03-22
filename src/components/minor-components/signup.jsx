import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../redux/actions/user-actions';

// TODO add password strength checker

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logged = useSelector((state)=> state.user.isLogged);
    const [notification, setNotif] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [allowRegistration, setAllowance] = useState(false); 
    const [loading, setLoad] = useState(false);

    const verify = () => {
        if (confirmPass !== password) {
            setError('Passwords do not match');
            setAllowance(false);
        } else if (!username || !password || !confirmPass) {
            setError('All fields must be filled');
            setAllowance(false);
        } else {
            setError('');
            setAllowance(true);
        }
    };

    const handleRegistration = (e) => {
        e.preventDefault(); 
        verify(); // Verify before proceeding
        if (!allowRegistration) return; // Don't proceed if not allowed
        setLoad(true);
        dispatch(register(username, password, callBackUpdate)).then(setLoad(false)); // Set loading false after registration
    };

    useEffect(() => {
        console.log('Checking success');
        console.log(logged);
        setNotif('Registered succesfully!');
        if (logged && allowRegistration) { // To avoid false call when log in logged is set
            // Success
            alert(notification);
            navigate('/Home');
        }
    }, [logged]);
    
    useEffect(() => {
        if(error){
            setAllowance(false);
        }
    }, [error]);

    function callBackUpdate(error){
        setError(error);
    }

    return (
        <div>
            <h3 className='startup-title'>Sign Up</h3>
            <form onSubmit={handleRegistration} className="form">
                <input
                    className='textform' 
                    value={username}  
                    onChange={(e) => setUsername(e.target.value)} 
                    onBlur={verify} 
                    type="text" 
                    placeholder="Username" 
                    required 
                />
                <input
                    className='textform'  
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    onBlur={verify} 
                    type="password" 
                    placeholder="Password" 
                    required 
                />
                <input
                    className='textform' 
                    value={confirmPass} 
                    onChange={(e) => setConfirmPass(e.target.value)}
                    onBlur={verify} 
                    type="password" 
                    placeholder="Repeat Password" 
                    required 
                />
                <button className='submit' type='submit' disabled={!allowRegistration || loading}> 
                    {loading ? 'Setting things up for you...' : 'Sign up'} 
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Signup;
