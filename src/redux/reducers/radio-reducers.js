
// Initial State for the radio data
const initialState = {
    radios:[],
    loaded: false,
    selectedKey: '',
    selectedRadio: {},
    selectedStation: {},
};

const initCurrentSong = {
    currentSong:{
        title: '',
        artist: '',
        albumCover: '', // TODO provide the path of ataraxia incase its null
        url:'',
    },
    loaded:false,
};

// Initial state for individual host
const initRadioHost = {
    hosts: 
    {        
        id: 0,
        name: 'Radio',
        country: 'UA',
        gettrackUrl: '',
        pathTT: '', // JSON path to track title
        pathTA: '', // JSON path to track artist
        pathTC: '', // JSON path to track album cover
    },
    loaded: false,
};

// Initial state for individual station
const initStation = {
    stations: {
        id: 0,
        idHostedBy: 0,
        name: 'Station',
        url: ''  // Stream URL
    },
    loaded: false
};


// Combined Reducer
export const radioReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'IMPORT_RADIOS':
            return {
                ...state,
                radios: action.payload,
            };
        case 'SELECT_RADIO': 
            return {
                ...state,
                selectedRadio: action.payload,
            }
        case 'SELECT_STATION':
            return {
                ...state,
                selectedStation: action.payload,
            }
        case 'SELECT_KEY':
            return{
                ...state,
                selectedKey: action.payload,
                loaded: true,
            }
        default:
            return state; // Return current state if action is not handled
    }
};

export const hostReducer = (state = initRadioHost, action) => {
    switch(action.type) {
        case 'IMPORT_HOST':
            return {
                ...state,
                hosts: [...state.hosts, { ...initRadioHost, ...action.payload }],
                loaded: true,
            };
        default: return state;
    }
}
export const stationReducer = (state = initStation, action) => {
    switch(action.type) {
        case 'IMPORT_STATION':
            return {
                ...state,
                stations: [...state.stations, { ...initStation, ...action.payload }],
                loaded: true,
            };
        default: return state;
    }
}

export const trackReducer = (state = initCurrentSong, action) =>{
    switch(action.type){
        case 'LOAD_SONG':
            return {
                ...state,
                currentSong: { // <-- Correct this to currentSong
                    title: action.payload.title,
                    artist: action.payload.artist,
                    albumCover: action.payload.albumCover,
                    url: action.payload.url,
                },
                loaded:true,
            };
        default:
        return state;
    }
}
