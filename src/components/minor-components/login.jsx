import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/actions/user-actions';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logged = useSelector((state)=> state.user.isLogged);
    const [notification, setNotif] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoad] = useState(false);

    useEffect(() => {
        if(logged){
            // alert("Logged in!");
            setTimeout(() => {
                navigate('/Home');
            }, 2000);
        }
    },[logged]);
    
    const handleLogin = (e) => {
        e.preventDefault();
        setLoad(true);
        dispatch(login(username, password, callBackUpdate)).then(setLoad(false));
    }

    function callBackUpdate(error){
        setError(error);
    }

  return (
        <div>
            <h3 className='startup-title'>Log In</h3>
            <form onSubmit={handleLogin} className="form">
                <input 
                    className='textform'
                    id="username" 
                    value={username}  
                    onChange={(e) => setUsername(e.target.value)} 
                    type="text" 
                    placeholder="Username" 
                    required 
                />
                <input 
                    className='textform'
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    type="password" 
                    placeholder="Password" 
                    required 
                />
                <button className='submit-2' type="submit" disabled={loading}> 
                    {loading ? 'Logging in...' : 'Log in'} 
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
  )
};

export default Login;
