import React, { useEffect, useState } from 'react';
import { findUser } from '../services/account-services';
import UserProfile_M from './minor-components/userProfile-medium';
import { useSelector } from 'react-redux';
import '../style/findUsers.css'
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const senderId = useSelector((state)=> state.user.id);
  console.log(senderId);

  // Debounce logic for smooth search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // useEffect to handle the search and prevent duplicates
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery) {
        setResults(null); // Reset results when searchQuery is empty
        return;
      }

      console.log('looking for', searchQuery);
      try {
        const resp = await findUser(searchQuery,senderId);
        console.log(resp);
        if (resp.status === 'success') {
          setResults(resp.users); // Set the results without duplicates
        }
      } catch (e) {
        console.log('Error:', e);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  const handleProfileClose = () => {
    setSelectedProfile(null); // Close the profile and show results again
  };

  return (
    <div className='find-users-container-main'>
      <h1 className='title-findUsers'>Find Users</h1>
      <div className='find-users-container'>
        <div className="searchBar">
          <input
            type="text"
            className='inp-search-users'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Use onChange instead of onBlur
            placeholder="Search for users"
          />
        </div>

        {/* Conditionally render the UserProfile_M component if selectedProfile is not null */}
        {selectedProfile ? (
          <div className="profile-overlay">
            <div className="profile-overlay-container">
              <button className="btn-close-profile" onClick={handleProfileClose}>×</button>
              <UserProfile_M profile={selectedProfile} />
            </div>
          </div>
        ) : null}
          <div className="results">
            {results === null ? (
              <p className='p-searchUsers-find'>Find and connect...</p>  // Displayed if results are still null
            ) : results.length === 0 ? (
              <p className='p-searchUsers'>No matching users found</p>  // Displayed if no results
            ) : (
              results.map((user, index) => (
                <div key={index} className="userResult" onClick={() => setSelectedProfile(user)}>
                  <img src="https://picsum.photos/200" alt="Profile" className='pfp-s-findUsers'/>
                  <div className='findUsers-info'>
                    <div className='findUsers-username'>Username | {user.username}</div>
                    <div className='findUsers-nickname'>Nickname | {user.nickname}</div>
                  </div>
                  <p className='p-findUsers-preview'>Preview Profile</p>
                </div>
              ))  // Display users if found
            )}
          </div>
        
      </div>
    </div>
  );
};

export default Search;
