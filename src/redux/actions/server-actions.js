export const joinRoom = (roomData) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'JOIN_ROOM',
                payload: {
                    server: {
                        id: roomData.id,
                        title: roomData.title,
                        joinUrl: roomData.joinUrl,
                        url: roomData.url,
                        capacity: roomData.capacity,
                        users: roomData.users,
                        activity: roomData.activity, 
                        userData: roomData.userData,
                    }
                }
            }    
        )
    }catch(e){
        console.error(`Failed to join room ${e}`);
    }
 }
export const updateUsers = (newUser) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'UPDATE_USERDATA',
                payload: newUser
            }    
        )
    }catch(e){
        console.error(`Failed to join room ${e}`);
    }
 }
export const updateFreeNodes = (freeNodes) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'UPDATE_NODES',
                payload: freeNodes
            }    
        )
    }catch(e){
        console.error(`Failed to update nodes ${e}`);
    }
}

