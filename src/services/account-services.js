import axios from 'axios';
const url = 'http://obesecat.atwebpages.com';

export const loginAPI = async (username, password) => {
    try {
        console.log('sending request...');
        const response = await axios.post(`${url}/login.php`,{username, password});
        if(response.data.status == 'success'){
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return checkResp(response);// send login response
    } catch (e){
        console.log('error resp.data');
        throw new Error(e.message);
    }
};

export const isLoggedIn = () => {
    // return !!localStorage.getItem('accessToken'); // Return true if the token exists
    return !!localStorage.getItem('user');
};

export const handleLogOut = () => {
    localStorage.removeItem('user'); // Clear the token
};

export const registerAPI = async (username, password) => {
    try{
        const response = await axios.post(`${url}/register.php`,{username, password});
        localStorage.setItem('accessToken', response.token); // Store access token 
        console.log(response);
        return checkResp(response);
    }
    catch(e){
        throw new Error(e.message);
    }
}
export const findUserUnique = async (username) => {
    try {
        const response = await axios.get(`${url}/search-by-username-unique.php`, {
            params: { username } 
        });
        return checkResp(response); 
    } catch (e) {
        throw e;
    }
}
export const findUser = async (username, senderId) => { //execludes the user who is sending the request
    try {
        const response = await axios.get(`${url}/search-by-username.php`, {
            params: {
                username: username,
                userId: senderId,
            }
        });
        return checkResp(response); 
    } catch (e) {
        throw e;
    }
}
export const getFriendList = async(userId) => { 
    try{
        const response = await axios.post(`${url}/manageFriends.php`, {
            action: 'getFriendList',
            userId: userId});
            if(response.data.message==='List Empty'){
            return ([]);
        }else{
            return (response.data.data);
        }
    }catch(e){
        throw e;
    }
}
export const getPendingList = async(userId) => { 
    try{
        console.log('getting pendings');
        const response = await axios.post(`${url}/manageFriends.php`, {
            action: 'getPending',
            userId: userId});
            // console.log(response);
        if(response.data.message === 'Pending list'){
            // console.log('got list');
            console.log(response.data.data);
            return(response.data.data);
        }else{
            return ([]);
        }

    }catch(e){
        throw e;
    }
}
export const acceptFriendRequest = async(userId, friendId) => { 
    try{
        const response = await axios.post(`${url}/manageFriends.php`, {
            action: 'acceptRequest',
            userId: userId,
            friendId: friendId
        });
        return checkResp(response);
    }catch(e){
        throw e;
    }
}
export const declineFriendRequest = async(userId, friendId) => { 
    try{
        const response = await axios.post(`${url}/manageFriends.php`, {
            action: 'declineRequest',
            userId: userId,
            friendId: friendId
        });
        return checkResp(response);
    }catch(e){
        throw e;
    }
}
export const sendFriendRequest = async(userId, friendId) => {
    try{
        const response = await axios.post(`${url}/manageFriends.php`, {
            action: 'add',
            userId: userId,
            friendId: friendId
        });
        return checkResp(response);
    }catch(e){
        throw e;
    }
}
export const deleteFriend = async(userId, friendId) => {
    try{
        const response = await axios.post(`${url}/manageFriends.php`, {
            action: 'remove',
            userId: userId,
            friendId: friendId
        });
        console.log(response.data);
        return checkResp(response);
    }catch(e){
        throw e;
    }
}
export const findNickname = async (nickname) => {
    try{
        const response = await axios.get(`${url}/search-by-nickname.php`, {params: {nickname}});
        return checkResp(response);
    }
    catch(e){
        throw e;
    }
}
export const findUsersById = async (ids) => {
    try{
        const response = await axios.post(`${url}/search-by-id.php`, 
            {ids: ids});
        return checkResp(response);
    }
    catch(e){
        throw e;
    }
}

export const getProfile = async (id) => {
    try {
        const response = await axios.get(`${url}/profile-customization-services/getProfile.php?`, {params: {id}});
        console.log('profile', response.data);
        return checkResp(response);
    } catch (error) {
        throw error;
    }
}
export const updateProfileMain = async (profileData) => {
    try {
      const response = await axios.post(
        `${url}/profile-customization-services/update-field.php`,
        profileData // send the JSON object directly
      );
      return checkResp(response);
    } catch (e) {
      throw e;
    }
  }

export const updatePfpService = async (pfp) => {

}
 export function checkResp(response){
    if(response.data.status == 'error'){
        // console.log('negative response');
        throw new Error(response.data.message);
    }else{
        // console.log('positive response...');
        // console.log(response.data);
        return response.data;
    }
}
