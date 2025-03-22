import { fetchRadioHosts, fetchStations, fetchRadios, fetchTrack } from "../../services/radio-services.js";

export const importHost = () => async (dispatch) => {
    try {
        const resp = await fetchRadioHosts();
        dispatch({
            type: 'IMPORT_HOST',
            payload: resp,
        });
    } catch (e) {
        throw new Error('Error importing hosts:', e.message); // Handle the error
    }
};

export const importStation = () => async (dispatch) => {
    try {
        const resp = await fetchStations();
        dispatch({
            type: 'IMPORT_STATION',
            payload: resp,
        });
    } catch (e) {
        throw new Error('Error importing stations:', e.message); 
    }
};

export const importRadio = () => async (dispatch) => {
    try {
        const resp = await fetchRadios(); 
        dispatch({
            type: 'IMPORT_RADIOS',
            payload: resp,
        });
    } catch (e) {
        throw new Error('Error importing radios: ', e.message); // Handle the error
    }
};

export const play = (radio, station) => async (dispatch) => {
    try{
        const resp = await fetchTrack(radio.gettrackUrl, radio.pathTT, radio.pathTA, radio.pathTC, station.id);
        dispatch(
            {
                type:'LOAD_SONG',
                payload: {
                    title: resp.title,
                    artist: resp.artist,
                    albumCover: resp.cover,
                    url: station.url,
                }
            }
        )
    }catch(e){
        throw new Error('Error loading track: ', e.message); 
    }
}

export const selectItems = (radioHost, station) => (dispatch) => {
    try{
        dispatch({type:'SELECT_RADIO', payload: radioHost});
        dispatch({type:'SELECT_STATION', payload: station});
        dispatch(play(radioHost, station));
    }catch(e){
        throw new Error('Error selecting items: ', e.message); 
    }    
}

export const selectKey = (key) => (dispatch) => {
    try{
        dispatch({type:'SELECT_KEY', payload: key}); 
    }catch(e){
        throw new Error('Error selecting items: ', e.message); 
    }    
}


export const initComponentData = () => async (dispatch, getState) => {
    await dispatch(importRadio()); // Dispatch the action to populate 'radios'
    // Now we get the state after the action has been dispatched
    const stateAfterImport = getState();
    const firstCountryKey = Object.keys(stateAfterImport.radio.radios)[0];
    const firstRadio = stateAfterImport.radio.radios[firstCountryKey][0];
    const firstStation = stateAfterImport.radio.radios[firstCountryKey][0]?.stations[0];

    dispatch(selectKey(firstCountryKey));
    dispatch(selectItems(firstRadio,firstStation));

    // Dispatch the play action only if firstRadio and firstStation are defined
    if (firstRadio && firstStation) {
        await dispatch(play(firstRadio, firstStation)); // Start playing the first station
        console.log();
    }
}