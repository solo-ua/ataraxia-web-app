import React, { useEffect, useState } from 'react';
import { acceptFriendRequest, declineFriendRequest, deleteFriend, findUserUnique, getProfile, sendFriendRequest } from '../../services/account-services';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePendingContactList, updateContactList } from '../../redux/actions/user-actions';
import Avatar_Viewer from './avatar-viewer';
import {Spinner} from './loader.jsx';

const View_Profile = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [profile, updateProfile] = useState(null);
    const [isFriend, setFriend] = useState(
        location.state?.isFriend !== undefined ? location.state?.isFriend : null
      );
      
    const mainUser = useSelector((state) => state.user);
    const friendList = useSelector((state) => state.profile.contacts);
    const pendingList = useSelector((state) => state.profile.pendingContacts);

    useEffect(() => { 
        const getLists = async() => { 
            console.log('running');
            await Promise.all([
                dispatch(updatePendingContactList(mainUser.id)),
                dispatch(updateContactList(mainUser.id)),
              ]);
         }
         getLists();
         return () => {
        };
     },[])

    useEffect(() => {
        const getData = async () => {
            try {
                const userResponse = await findUserUnique(username);
                setUser(userResponse.users[0]);
                console.log('friends:',friendList);
                console.log('pending:',pendingList);
                // After user data is fetched, check the status of friend and pending requests
                if (checkStatusRecieved(userResponse.users[0].id)) {
                    setFriend(2); // Request received
                } else if (checkStatus(userResponse.users[0].id)) {
                    setFriend(0); // Request sent
                } else if (checkFriendStatus(userResponse.users[0].id)) {
                    setFriend(1); // Already friends
                }
            } catch (error) {
                console.log(error);
            }
            console.log('friend state: ', isFriend);
        };
        getData();
    }, [username, pendingList, friendList]);  // Ensure it runs when data is fetched

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const profileResponse = await getProfile(user.id);
                updateProfile(profileResponse.profile);
            } catch (e) {
                console.log(e);
            }
        };
        if (user) getProfileData();
    }, [user]);

    const checkStatus = (id) => {
        const c = (pendingList.some((pending) => pending.user.id === id && !pending.isReceiver))
        console.log(c);
        return c;
    };
    const checkStatusRecieved = (id) => {
        return (pendingList.some((pending) => pending.user.id === id && pending.isReceiver))
        // return pendingList.some((pending) => pending.user.id === id && !pending.isReceiver);
    };

    const checkFriendStatus = (id) => {
        return friendList.some((friend) => friend.id === id);
    };

    const sendRequest = async () => {
        try {
            const resp = await sendFriendRequest(mainUser.id, user.id);
            if (resp.status === 'success') {
                setFriend(0); // Request sent state
            }
            dispatch(updatePendingContactList(mainUser.id));
        } catch (error) {
            console.log(error);
        }
    };

    const acceptRequest = async () => {
        try {
            const resp = await acceptFriendRequest(mainUser.id, user.id);
            if (resp.status === 'success') {
                await dispatch(updatePendingContactList(mainUser.id));
                await dispatch(updateContactList(mainUser.id));
                setFriend(1); // Mark as friends
            }
        } catch (error) {
            console.log(error);
        }
    };

    const declineRequest = async () => {
        try {
            const resp = await declineFriendRequest(mainUser.id, user.id);
            if (resp.status === 'success') {
                setFriend(null); // No longer pending
            }
            dispatch(updatePendingContactList(mainUser.id));
        } catch (error) {
            console.log(error);
        }
    };
    const tearConnection = async () => {
        try {
            const resp = await deleteFriend(mainUser.id, user.id);
            if (resp.status === 'success') {
                setFriend(null); // No longer pending
            }
            dispatch(updateContactList(mainUser.id));
        } catch (error) {
            console.log(error);
        }
    };

    if (!user || !profile) {
        return <Spinner></Spinner>;
    }

    return (
        <div className='user-profile-body'>
            <h1 className='user-profile-title'>User Profile</h1>
            <div className='userProfile-avatar'>
                
                <Avatar_Viewer avatarUrl='/seriousTestAvatar.glb'/>
               
              </div>

            <div className='userProfile-main'>
            <div className='userProfile-header'>
                <img src="https://picsum.photos/200" alt="Profile" className='pfp-l' />
                
                <div className="userProfile-field">
                    <label className="userProfile-label">Nickname |</label>
                    <textarea className='userProfile-textarea-headers' value={user.nickname} readOnly />
                </div>
                <div className="userProfile-field">
                    <label className="userProfile-label">Username |</label>
                    <textarea className='userProfile-textarea-headers' value={user.username} readOnly />
                </div>
                <div className="userProfile-field">
                    <label className="userProfile-label">Date Joined |</label>
                    <textarea className='userProfile-textarea-headers userProfile-dateJoined' value={user.dateJoined} readOnly />
                </div>
            </div>
            <div className='userProfile-details'>
                <div className="userProfile-field">
                    <label className="userProfile-label">About |</label>
                    <textarea className='userProfile-textarea-details' value={user.about} readOnly />
                </div>
                <div className="userProfile-field">
                    <label className="userProfile-label">Aim |</label>
                    <textarea className='userProfile-textarea-details' value={profile.aim} readOnly />
                </div>
                <div className="userProfile-field">
                    <label className="userProfile-label">Field of Study/Work |</label>
                    <textarea className='userProfile-textarea-details' value={profile.fieldOfStudyWork} readOnly />
                </div>
                <div className="userProfile-field">
                    <label className="userProfile-label">Hobbies |</label>
                    <textarea className='userProfile-textarea-details' value={profile.hobbies} readOnly />
                </div>
                <div className="userProfile-field">
                    <label className="userProfile-label">Favorite Genres |</label>
                    <textarea className='userProfile-textarea-details' value={profile.genres} readOnly />
                </div>
            </div>
        </div>

            <div className="userProfile-actions">
                {isFriend === 0 && mainUser.id !== 0 ? (
                    <button className='btn-userProfile-action' disabled={true}>Request sent</button>
                ) : isFriend === 1 && mainUser.id !== 0 ? (
                    <>
                        <button className='btn-userProfile-action' onClick={tearConnection}>Tear Connection?</button>
                    </>
                ) : isFriend === 2 && mainUser.id !== 0 ? (
                    <>
                        <button className='btn-userProfile-action' onClick={acceptRequest}>Accept request</button>
                        <button className='btn-userProfile-action' onClick={declineRequest}>Decline request</button>
                    </>
                ) : mainUser.id !== 0 ? (
                    <button className='btn-userProfile-action' onClick={sendRequest}>Initiate a Connection</button>
                ) : null}
            </div>
        </div>
    );
};

export default View_Profile;
