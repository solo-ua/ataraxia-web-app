import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../redux/actions/user-actions';
// import Radio from '../components/minor-components/radio';
import Radio from './minor-components/radio';
import ProfilePicture from './minor-components/profile-picture-updater';
import '../style/home.css'

const Home = () => {
    const navigate = useNavigate();
    const user = useSelector((state)=>state.user);
    const dispatch  = useDispatch();
    const isLogged = useSelector((state)=> state.user.isLoggedIn);

    useEffect(()=>{},[]);
    const handleLogout = () => { 
        dispatch(logOutUser());
        if(isLogged){
            console.log(isLogged);
        }
        else{
            navigate('/');
        }
    }
    return(
        <div className='body'>
            <div className="top-right-corner">
                {/* TODO change pfp */}
                <img src="https://picsum.photos/200" alt="profile pic" className="pfp-xs" onClick={ () => { navigate('/me') }}/>
                <p className='p-homeProfile'>{user.username}</p>
            </div>
            <div className='anim-container'>
                <h1 className='title-home ataraxia'>Ataraxia </h1>
                <h1 className='title-home explore' onClick={() => { navigate('/search') }}>Explore</h1>
                <div className='title-home filler'>,</div>
                <h1 className='title-home listen'>Listen</h1>
                <div className='title-home filler'>, &</div>
                <h1 className='title-home escape'  onClick={() => { navigate('/servers') }}>Escape</h1>
            </div>
            
            {/* Add radio here */}
            <div className='radio-home-container'>
                <Radio/>
            </div>
            <div className="actions">
                <h3 className='title-mood'>What are you in the mood for?</h3>
                <div className='home-nav'>
                    <div className='home-nav-option'
                    onClick={() => { navigate('/me') }}
                    >Profile</div>
                    <div className='home-nav-option'
                    onClick={() => { navigate('/servers') }}
                    >Servers</div>
                    <div className='home-nav-option'
                    onClick={() => { navigate('/search') }}
                    >Search people</div>
                    <div className='home-nav-option'
                    onClick={() => { navigate('/settings') }}
                    >Settings</div>
                <button 
                    className='btn-logout'
                    onClick={handleLogout}
                >Logout</button>
                </div>
            </div>
        </div>
    );
}
export default Home;