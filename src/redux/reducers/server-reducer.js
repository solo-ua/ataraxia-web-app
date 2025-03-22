import { userData } from "three/webgpu"

// reducer for general information about a server
const initServer = {
    server: {    
        id: 0,
        title: '',
        joinUrl: '',
        url: '',
        capacity: 0,
        users: 0,
        activity: '',
        userData: {},
        freeNodes: null,
    },
    userIsInRoom: false,
}


export const serverReducer = (state = initServer, action) => { 
    switch(action.type){
        case 'JOIN_ROOM':
            return {
                ...state,
                server: {
                    id: action.payload.server.id,
                    title: action.payload.server.title,
                    joinUrl: action.payload.server.joinUrl,
                    url: action.payload.server.url,
                    capacity: action.payload.server.capacity,
                    users: action.payload.server.users,
                    userData: action.payload.server.userData,
                    activity: action.payload.server.activity,
                },
                // freeNodes: action.payload.freeNodes,
                userIsInRoom: true,
            }
        case 'LEAVE_ROOM':
            return {
                ...state,
                server:{
                    id: '',
                    title:'',
                    joinUrl: '',
                    url: '',
                    capacity: 0,
                    users: 0,
                    activity: '', 
                },
                userIsInRoom: false,
            }
        case 'UPDATE_FREE_NODES':
            return {
                ...state,
                freeNodes: action.payload,
            }
        case 'UPDATE_USERDATA':
            return {
                ...state,
                server: {
                ...state.server,
                userData: [...state.server.userData, action.payload], 
                },
            };              
        default: return state;
    }
}
