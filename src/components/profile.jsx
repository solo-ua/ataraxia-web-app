import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  editProfileAction,
  updateContactList,
  updatePendingContactList,
  updateProfileAction,
} from '../redux/actions/user-actions';
import { Link, useNavigate } from 'react-router-dom';
import Avatar_Viewer from './minor-components/avatar-viewer';
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors for required data
  const user = useSelector((state) => state.user);
  const profile = useSelector((state) => state.profile);
  const friendList = useSelector((state) => state.profile.contacts);
  const pendingRequestsList = useSelector((state) => state.profile.pendingContacts);

  // Loading state for overall readiness
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); 
  
  const handleInAppNavigation = (username, isFriend) => {
    navigate(`/Ataraxia-Enjoyer/${username}`, {
      state: { isFriend }, // Add the requester ID here
    });
  };
  useEffect(() => {
    return () => {
    };
  },[])
  useEffect(() => {
    const getData = async () => {
      try {
        // Wait for all dispatches to resolve
        await Promise.all([
          dispatch(updateContactList(user.id)),
          dispatch(updatePendingContactList(user.id)),
          dispatch(updateProfileAction(user.id)),
        ]);

        // Once data is fetched, set loading to false
        setLoading(false);
        console.log(profile);
      } catch (error) {
        console.error('Error fetching profile or contacts:', error);
        setLoading(false); // Stop loading even on error
      }
    };

    if (user.id) {
      getData();
    }
  }, [dispatch, user.id]);

  // Wait for data to finish loading before rendering
  if (loading) {
    return (
      <div className="loading">
        <p>Loading your profile...</p>
      </div>
    );
  };
  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  // Function to gather all values into an object
  const gatherProfileData = () => {
    const updatedProfile = {
      aim: document.querySelector('[name="aim"]').value,
      fieldOfStudyWork: document.querySelector('[name="fieldOfStudyWork"]').value,
      hobbies: document.querySelector('[name="hobby"]').value,
      genres: document.querySelector('[name="genre"]').value,
      otherInterests: document.querySelector('[name="otherInterests"]').value,
    };
  
    const formattedData = {
      id: user.id,
      fieldsToUpdate: {
        profile: {
          aim: updatedProfile.aim,
          fieldOfStudyWork: updatedProfile.fieldOfStudyWork,
          otherInterests: updatedProfile.otherInterests,
        },
        profile_hobbies: {
          hobby: updatedProfile.hobbies
        },
        profile_musicGenre: {
          genre: updatedProfile.genres
        }
      }
    };
    dispatch(editProfileAction(updatedProfile, formattedData))
    console.log('Formatted JSON for API:', formattedData);
    return formattedData;
  };
  

  // Render profile content
  return (
    <div className='user-profile-body myProfile'>
      <h1 className='user-profile-title'>My Profile</h1>
      <div className='userProfile-avatar'>
                
        <Avatar_Viewer avatarUrl='/seriousTestAvatar.glb'/>
       
      </div>
          <button  className={`btn-edit-profile ${editMode ? 'active-edit' : ''}`} onClick={handleEditClick}>Edit</button>
          {
            editMode?
            (<button  className={`btn-edit-profile-save`} onClick={gatherProfileData}>Save</button>) : null
          }
      <div className="userProfile-main">
        <div className="userProfile-header">
          <img src="https://picsum.photos/200" alt="Profile Picture" className="pfp-l" />
          <div className="userProfile-field">
            <label className="userProfile-label">Nickname:</label>
            <textarea name='nickname' className='userProfile-textarea-details' defaultValue={user.nickname} readOnly={!editMode} />
          </div>
          <div className="userProfile-field">
            <label className="userProfile-label">Username:</label>
            <textarea className='userProfile-textarea-details' defaultValue={user.username} readOnly />
          </div>
          <div className="userProfile-field">
            <label className="userProfile-label">Date Joined:</label>
            <textarea className='userProfile-textarea-details' defaultValue={user.dateJoined} readOnly />
          </div>
        </div>
          <div className="userProfile-details">
            <div className="userProfile-field">
              <label className="userProfile-label">About:</label>
              <textarea name='about' className='userProfile-textarea-details' defaultValue={user.about} readOnly={!editMode} />
            </div>
            <div className="userProfile-field">
              <label className="userProfile-label">Aim:</label>
              <textarea name='aim' className='userProfile-textarea-details' defaultValue={profile.aim} readOnly={!editMode} />
            </div>
            <div className="userProfile-field">
              <label className="userProfile-label">Field of Study/Work:</label>
              <textarea name='fieldOfStudyWork' className='userProfile-textarea-details' defaultValue={profile.fieldOfStudyWork} readOnly={!editMode} />
            </div>
            <div className="userProfile-field">
              <label className="userProfile-label">Hobbies:</label>
              <textarea name='hobby' className='userProfile-textarea-details' defaultValue={profile.hobbies} readOnly={!editMode} />
            </div>
            <div className="userProfile-field">
              <label className="userProfile-label">Favorite Genres:</label>
              <textarea name='genre' className='userProfile-textarea-details' defaultValue={profile.genres} readOnly={!editMode} />
            </div>
            <div className="userProfile-field">
              <label className="userProfile-label">Other Interests:</label>
              <textarea name='otherInterests' className='userProfile-textarea-details' defaultValue={profile.otherInterests} readOnly={!editMode} />
            </div>
          </div>
        </div>

        {/* CONTACTS */}
      <div className="myprofile-list-contactList">
        <div className="myprofile-friendListTab">
          <h2>Contacts</h2>
          {Array.isArray(friendList) && friendList.length === 0 ? (
            <p>Oof! It's empty in here. Can't relate.</p>
          ) : (
            friendList.map((friend, index) => (
              <div key={index} className="myprofile-contact" onClick={(e) => { handleInAppNavigation(friend.username, 1) }}> 
                <div>{friend.username}</div>
              </div>
            ))
          )}
        </div>

        {/* PENDING */}
        <div className="myprofile-pendingListTab">
          <h2>Pending Connections...</h2>
          <div className='myprofile-pendingListTab-results'>
            {pendingRequestsList?.length === 0 ? (
              <p className='mock'>Oof! It's empty in here. Can't relate.</p>
            ) : (
              pendingRequestsList?.map((pending, index) => (
                pending.isReceiver &&
                (<div key={index} className="myprofile-contact">
                  <div>Username | {pending.user.username}</div>
                  <Link to={`/Ataraxia-Enjoyer/${pending.user.username}`}><button className='btn-viewProfile' onClick={(e) => { handleInAppNavigation(pending.user.username, 2) }}>View Profile</button></Link>
                </div>
                )
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
