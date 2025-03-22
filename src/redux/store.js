import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk"; // Correct import
import {
    userReducer,
    profileReducer,
    notificationReducer,
    errorReducer,
} from "./reducers/user-reducer";
import {
    hostReducer,
    radioReducer,
    stationReducer,
    trackReducer,
} from "./reducers/radio-reducers";
import { serverReducer } from "./reducers/server-reducer";
import { inServerReducer } from "./reducers/inServer-reducer";

// Functions to persist and load state
const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("reduxState", serializedState);
    } catch (e) {
        console.error("Could not save state to localStorage:", e);
    }
};

const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem("reduxState");
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (e) {
        console.error("Could not load state from localStorage:", e);
        return undefined;
    }
};

// Combine reducers
export const rootReducer = combineReducers({
    user: userReducer,
    profile: profileReducer,
    notification: notificationReducer,
    radio: radioReducer,
    host: hostReducer,
    station: stationReducer,
    track: trackReducer,
    server: serverReducer,
    inServer: inServerReducer,
});

// Load persisted state
const persistedState = loadStateFromLocalStorage();

// Create the store
export const Store = configureStore({
    reducer: rootReducer,
    preloadedState: persistedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// Save state to localStorage on every state update
Store.subscribe(() => {
    saveStateToLocalStorage(Store.getState());
});
