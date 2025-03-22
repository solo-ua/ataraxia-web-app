import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile_M = ({ profile }) => {
  const navigate = useNavigate();
  const friendList = useSelector((state)=>state.profile.contacts);
  const handleInAppNavigation = () => {
    const isFriend = checkStatus(profile.id);
    navigate(`/Ataraxia-Enjoyer/${profile.username}`, {
      state: { isFriend }, // Add the requester ID here
    });
  };

  const checkStatus = (id) => {
    console.log(friendList);
    return 0;
    if (friendList) {
      const x = friendList.some(friend => friend.id === id) ? 1 : 0; 
      return x;
    } else {
      return null; 
    }
  };
  

  return (
    <div className='userProfile-m'>
      <img src="https://picsum.photos/200" className="pfp-m" />
      <div className="user-profile-info-m">
        <div>
          <div className="user-profile-info-nickname-m">Nickname | {profile.nickname}</div>
          <div className="user-profile-info-username-m">Username | {profile.username}</div>
          <div className="user-profile-info-dateJoined-m">Member since | {profile.dateJoined}</div>
        </div>
        <div className="user-profile-info-Description-m">
          <i className="grey-txt">Description |</i> {profile.about}
        </div>
      </div>
      <div className="user-profile-actions-m">
        {/* link-based navigation */}
        <Link to={`/Ataraxia-Enjoyer/${profile.username}`}>
          <button onClick={handleInAppNavigation} className='btn-viewProfile-m'>View Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile_M;
