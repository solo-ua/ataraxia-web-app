import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { isLoggedIn, handleLogOut} from '../services/account-services'; 
import { useDispatch, useSelector } from 'react-redux';
import { loginExistingUser } from '../redux/actions/user-actions';
import { Spinner } from './minor-components/loader';

const Startup = () => {
    const [loading, setLoading] = useState(true);
    const [message, setLoadingMessage] = useState("Welcome! Kindly wait while we prepare...");
    const logged = useSelector((state)=> state.user.isLogged);
    const navigate = useNavigate(); // Initialize navigate function
    const dispatch = useDispatch();
    useEffect(() => {
        const checkToken = () => {
            console.log('checking token');
            if(logged){
                setTimeout(() => {
                    navigate('/Home');
                }, 3000);
            } else {
                setLoadingMessage('Ataraxia');
                setTimeout(() => {
                    navigate('/Ataraxia'); // Navigate to the login page
                }, 5000); // 5 seconds
            }
            // if (isLoggedIn()) {
            //     setLoadingMessage('You are logged in successfully! Constructing your homepage...');
            //     dispatch(loginExistingUser());
            //     setTimeout(() => {
            //         // handleLogOut();
            //         navigate('/home'); // Navigate to the homepage
            //     }, 3000); // 3 seconds
            // }
            
        };

        checkToken(); // Call the function to check the token
    }, []); 

    return (
        <div style={{ margin: "auto", textAlign: "center", fontSize: "24px" }}>
            {/* Animation can go here */}
            {loading ? (<Spinner>message</Spinner>) : null} {/* Display message only when loading */}
        </div>     
    );
};

export default Startup;
