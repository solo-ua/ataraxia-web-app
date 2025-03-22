import axios from "axios";
import { checkResp } from "./account-services.js";
const url = 'http://obesecat.atwebpages.com';

export const fetchRadioHosts = async() => {
    try{
        const response = await axios.get(`${url}/radio-services/radioHosts.php`);
        const hosts = checkResp(response); // this should return a json array of objects if status is success
        return hosts.hosts;

    }catch(e){
    throw new Error('Service error - ' , e.message);    
    }
}
export const fetchStations = async() => {
    try{
        const response = await axios.get(`${url}/radio-services/stations.php`);
        const stations = checkResp(response); // this should return a json array of objects if status is success
        return stations.stations;
    }catch(e){
        throw new Error('Service error - ' , e.message);
    }
}
export const fetchRadios = async() =>{
    try{
        const response = await axios.get(`${url}/radio-services/radio.php`);
        const radios = checkResp(response); // this should return a json array of objects if status is success
        return radios.radios;
    }catch(e){
        throw new Error('Service error - ' , e.message);
    }
}

// Helper function to get nested properties using a path string
const getNestedValue = (obj, path) => {
    return path
        .split('.') // split on dots
        .reduce((acc, key) => acc && acc[key], obj); // traverse the path
};


export const fetchTrack = async(url, pathTT, pathTA, pathTC, stationId) => {
    try{
        let response='';
        if(stationId){ // In case radio host has more than one station
            response = await axios.get(url.replace('${stationId}',stationId));
        }else{ // In case radio host has only one station
            response = await axios.get(url);
        }
        const trackInfo = {
            title: getNestedValue(response.data, pathTT),
            artist: getNestedValue(response.data, pathTA),
            cover: getNestedValue(response.data, pathTC),
        };
        return trackInfo;
    }catch(e){
        throw new Error('Service error - ' , e.message);
    }
}


// Used for unit testing:
// async function main(){
//     // const hosts = await fetchRadioHosts();
//     // console.log(hosts);
    
//     // const stations = await fetchStations();
//     // console.log(stations);
    
//     const song = await fetchTrack(
//     'https://iris-bob.loverad.io/flow.json?station=${stationId}',
//     'result.entry.0.song.entry.0.title',
//     'result.entry.0.song.entry.0.artist.entry.0.name',
//     'result.entry.0.song.entry.0.cover_art_url_xxl',
//     81
// );
//     console.log(song);

// }
// main();
