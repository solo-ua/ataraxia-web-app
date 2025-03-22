/*
    Here we define the actions of every user, specifically the type and such
    purpose is to encapsulate all the information needed to perform a specific 
    state update.
    The typical flow of information is:
    API SERVICES: 
        -   functions that send requests and retrieve responses
        -   they focus solely on communicating with the backend and returning data. 
            They are reusable components that can be used anywhere in your app.
    ACTIONS: 
        -   Calls the appropriate API service
        -   Action creators manage the flow of data and side effects within your Redux application
        -   They not only make API calls (potentially using services) 
            but also handle what happens with that data (like dispatching actions based on the results).
        -   They focus on how data is managed in your application's state. 
            This includes dispatching actions, updating the Redux store, and handling async logic (like using middleware).
*/ 
import {findUsersById, getFriendList, getPendingList, getProfile, handleLogOut, loginAPI, registerAPI, updateProfileMain} from '../../services/account-services';

// defining action
export const login = (username, password, callBackFunction) => async (dispatch) =>{ // we use redux thunk which RETURNS AN ASYNC FUNCTION
    try{
        const resp = await loginAPI(username,password);
        dispatch({
            type: 'LOGIN',
            payload: {
                id: resp.id,
                username: resp.username,
                nickname: resp.nickname,
                about: resp.about,
                dateJoined: resp.dateJoined,
            },
        });
    }catch(e){
        callBackFunction(e.message);
    }
}
export const loginExistingUser = () => (dispatch) =>{ // we use redux thunk which RETURNS AN ASYNC FUNCTION
    const resp = JSON.parse(localStorage.getItem('user'));
    console.log('resp is:', resp );
    try{
        dispatch({
            type: 'LOGIN',
            payload: {
                id: resp.id,
                username: resp.username,
                nickname: resp.nickname,
                about: resp.about,
                dateJoined: resp.dateJoined,
            },
        });
    }catch(e){
        callBackFunction(e.message);
    }
}

export const register = (username, password, callBackFunction) => async (dispatch) =>{
    try{
        const resp = await registerAPI(username, password);
        dispatch({
            type: 'REGISTER',
            payload: {
                id: resp.id,
                username: resp.username,
                nickname :resp.nickname,
                about: resp.about,
                dateJoined: resp.dateJoined,
            }
        });

    }catch(e){
        callBackFunction(e.message);
    }
}

export const setFieldofStudyWork = (accountID, newValue) => async (dispatch) => {
    try{
        const resp = await updateProfileMain(accountID, 'fieldOfStudyWork', newValue);
        // If successful, we update the value
        dispatch({
            type: 'SET_FIELDOFSTUDYWORK',
            payload: newValue,
        })
        dispatch({
            type: 'SET_NOTIF',
            payload: 'Field updated!',
        });
    }catch(e){
        dispatch({
            type: 'SET_ERROR',
            payload: 'Error occured, could not update field.',
        });
    }
}

export const logOutUser = () => async(dispatch) => { 
    try{
        handleLogOut();
        dispatch({
            type:'LOGOUT',
        })
    }catch(e){
        console.log('Error Logging Out: ', $e);
    }
 } 

export const updateContactList = (userId) => async(dispatch) =>{ 
    try {
        const resp = await getFriendList(userId);
        const ids = [];
        let contactList = resp;
        if(resp.length>0){ // getting profiles by ID
            resp.forEach(user => {
                ids.push(user.matchedId); 
            });
            contactList = await findUsersById(ids);
        }
        // console.log('contact list:',contactList);
        dispatch({
            type: 'UPDATE_CONTACTS',
            payload: contactList.users, //directly brings the friendlist
        });
    } catch (error) {
        console.log(error);
    }
 }
export const updatePendingContactList = (userId) => async(dispatch) =>{ 
    try {
        const resp = await getPendingList(userId);
        const ids = [];
        let pendingContacts = resp;
        if (resp.length > 0) {
            // Collect ids where isReceiver is true
            resp.forEach(user => {
                ids.push(user.matchedId);
            });
    
            // Get the full user profiles by IDs
            pendingContacts = await findUsersById(ids);
            
            // Now combine the two arrays: resp (which has isReceiver flags) and contactList (which has user data)
            const result = pendingContacts.users.map((user, index) => {
                return {
                    user: user, 
                    isReceiver: resp[index].isReceiver
                };
            });
            dispatch({
                type: 'UPDATE_PENDING_CONTACTS',
                payload: result, // Send the combined result
            });
        }else{
            dispatch({
                type: 'UPDATE_PENDING_CONTACTS',
                payload: [], // Send the combined result
            });

        }
    } catch (error) {
        console.log(error);
    }
    
 }
export const updateProfileAction = (userId) => async(dispatch) =>{ 
    try {
        const resp = await getProfile(userId);
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: resp.profile, 
        });
    } catch (error) {
        console.log(error);
    }
 }
export const editProfileAction = (localUpdate, formattedData) => async(dispatch) =>{ 
    console.log('data sent:', localUpdate);
    try {
        const resp = await updateProfileMain(formattedData);
        console.log(resp);
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: localUpdate, 
        });
    } catch (error) {
        console.log(error);
    }
 }
export const setFriendListPrivacy = (privacy) => (dispatch) =>{ 
    try {
        dispatch({
            type: 'SET_FRIEND_LIST_PRIVACY',
            payload: privacy, 
        });
    } catch (error) {
        console.log(error);
    }
 }