const initStateAcc = {
    id: 0,
    username: 'Guest',
    nickname: 'Wannabe Mysterious',
    about: 'Hi there!',
    dateJoined: 'I have yet to join',
    isLogged: false,
};
const initStateProf = {
    fieldOfStudyWork: '',
    aim: '',
    otherInterests: '',
    musicGenre: [],
    hobbies: [],
    contacts: [],
    pendingContacts: [],
    avatars: null,
    friendListPrivacy: false,
};
const initNotif = {
    title: '',
    message: '',
};
const initError = {
    message: '',
};

export const userReducer = (state = initStateAcc, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                id: action.payload.id,
                username: action.payload.username,
                nickname: action.payload.nickname,
                about: action.payload.about,
                dateJoined: action.payload.dateJoined,
                isLogged: true,
            };
            
            case 'REGISTER':
                return{
                    ...state,
                    id: action.payload.id,
                    username: action.payload.username,
                    nickname: action.payload.nickname,
                    about: action.payload.about,
                    dateJoined: action.payload.dateJoined,
                    isLogged: true,
            };
        case 'UPDATE_NICKNAME':
            return {
                ...state,
                nickname: action.payload,
            };
        case 'UPDATE_ABOUT':
            return {
                ...state,
                about: action.payload,
            };
        case 'LOGOUT':
            return initStateAcc; // Resetting to initial state
        default:
            return state; // Always return the current state by default
    }
};

export const profileReducer = (state = initStateProf, action) => {
    switch (action.type) {
        case 'UPDATE_PROFILE': 
            return {
                ...state,
                fieldOfStudyWork: action.payload.fieldOfStudyWork,
                aim: action.payload.aim,
                otherInterests: action.payload.otherInterests,
                genres: action.payload.genres,
                hobbies: action.payload.hobbies,
                avatars: action.payload.avatars,
            };
        case 'SET_FIELDOFSTUDYWORK':
            return {
                ...state,
                fieldOfStudy: action.payload,
            };
        case 'SET_AIM':
            return { ...state, ...action.payload };
        case 'SET_OTHERINTERESTS':
            return { ...state, ...action.payload };
        case 'UPDATE_CONTACTS': 
            return {
                ...state, 
                contacts: action.payload || [] 
            }
        case 'UPDATE_PENDING_CONTACTS': 
            return {
                ...state, 
                pendingContacts: action.payload || [] 
            }
        case 'SET_FRIEND_LIST_PRIVACY': 
            return {
                ...state, 
                friendListPrivacy: action.payload || false 
            }
        default:
            return state; // Always return the current state by default
    }
};

// Fix notificationReducer
export const notificationReducer = (state = initNotif, action) => {
    switch (action.type) {
        case 'SET_NOTIF':
            return {
                ...state,
                title: action.payload.title,  // Set the title if you want to use it
                message: action.payload.message,
            };
        case 'CLEAR_NOTIF':
            return{
                ...state,
                title: '',
                message: '',
            }
        default:
            return state; // Return initial state if action type does not match
    }
};

// Fix errorReducer
export const errorReducer = (state = initError, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return {
                ...state,
                message: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                message: '',
            };
        default:
            return state; // Return initial state if action type does not match
    }
};
