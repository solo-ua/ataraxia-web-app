// Dependencies and imports (assuming Redux and your actions are installed and available)
// Import necessary modules with ES syntax
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { importHost, importStation, importRadio, play } from './radio-actions.js'; // Ensure the path is correct
import { fetchTrack } from '../../services/radio-services.js';

const initialState = {
    radios:[],
    currentSong : {
        title: '',
        artist: '',
        albumCover: '', 
        url:'',
    }
};

const initCurrentSong = {
    title: '',
    artist: '',
    albumCover: '', 
    url:'',
}

// Initial state for individual host
const initRadioHost = {
    id: 0,
    name: 'Radio',
    country: 'UA',
    gettrackUrl: '',
    pathTT: '', // JSON path to track title
    pathTA: '', // JSON path to track artist
    pathTC: '', // JSON path to track album cover
    stations: [],
    exists: false,
};

// Initial state for individual station
const initStation = {
    id: 0,
    idHostedBy: 0,
    name: 'Station',
    url: '' // Stream URL 
};

// Mock reducer - Replace with your actual reducer if you want full functionality
function rootReducer(state = initialState, action) { // Use the initial state you defined
    switch (action.type) {
        case 'IMPORT_RADIOS':
            return {
                ...state,
                radios: action.payload,
            };
        
            case 'LOAD_SONG':
                // TODO: SEPARATE SONG FROM THE REST
                // console.log('LOAD_SONG action received:', action);
                return {
                    ...state,
                    currentSong: { // <-- Correct this to currentSong
                        title: action.payload.title,
                        artist: action.payload.artist,
                        albumCover: action.payload.albumCover,
                        url: action.payload.url,
                    }
                };
        default:
            return state; // Return current state if action is not handled
    }
};

const store = createStore(rootReducer, applyMiddleware(thunk));


async function unitTest() {
    await store.dispatch(importRadio()); // Dispatch the action to populate 'radios'

    // Retrieve the state using getState to log the updated radios array
    const stateAfterImport = store.getState();
    const firstCountryKey = Object.keys(stateAfterImport.radios)[0];
    const firstRadio = stateAfterImport.radios[firstCountryKey][0];
    const firstStation = stateAfterImport.radios[firstCountryKey][0].stations[0];

    // Dispatch the play action
    await store.dispatch(play(firstRadio, firstStation));

    // Log the state again after the dispatch to see the updates
    // const finalState = store.getState();
    console.log( store.getState((state)=>state.radios));
}

// Run the test
unitTest();

