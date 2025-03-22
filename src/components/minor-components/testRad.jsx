import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { initComponentData, selectItems, selectKey, play } from '../../redux/actions/radio-actions';
import { setCurrentRadio } from '../../redux/actions/inServer-actions';
import '../../style/radioStyle.css'

const RadioTest = () => {
    const dispatch = useDispatch();
    const radios = useSelector((state)=>state.radio.radios); // Full data array 
    const radioLoaded = useSelector((state)=>state.radio.loaded); // To check if data has been loaded
    const currentTrack = useSelector((state)=>state.track.currentSong);
    const selectedKey = useSelector((state) => state.radio.selectedKey); // Country code key that was being selected
    const [selectedRadio, setSelectedRadio] = useState(useSelector((state) => state.radio.selectedRadio)); // Radio host that has been selected
    const [selectedStation, setSelectedStation] = useState(useSelector((state) => state.radio.selectedStation)); // Station that has been selected
    const audioRef = useRef();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    
    useEffect(()=>{
        dispatch(initComponentData()); // initiates the first radio station to play its track
    },[]);

    const handleSelection = (radio, station) => { 
        // instant batch update
        const setSelectedStationAndRadio = (station, radio) => {
            setSelectedStation(station);
            setSelectedRadio(radio);
        };
        setSelectedStationAndRadio(station, radio);
        
        dispatch(setCurrentRadio(radio,station)); // for public user data
        dispatch(selectItems(radio,station)); // for the local radio and the station selection
        
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        //update src
        audioRef.current.src = station.url;
        //and now play it yippee 
        audioRef.current.play()
    }
    const handleSelectedKey = (key) => { 
        dispatch(selectKey(key));
    }

    const showMenu = () => {
      setIsMenuVisible(!isMenuVisible);
    }

    return (
        !radioLoaded ? <div>Loading...</div> : 
        <div className='radio'>
          <div className='radio-top'>
            <img src={currentTrack.albumCover} alt='Album Cover' className='albumCover' />
            {currentTrack.title}
            <br />
            {currentTrack.artist}
          </div>
          <div className='radio-bottom'>
            {/* <div className='selected-radio-name'>{selectedRadio.name}</div>
            <div className='selected-radio-country'>{selectedRadio.country}</div> */}
            {selectedRadio.name}
            {selectedRadio.country}
            <button className='btn-radio-menu' onClick={showMenu}>☰</button>
          </div>
          
          {/* Conditionally render the menu */}
          {isMenuVisible && (
            <div className='details'>
              <div className='radio-horizontal-scroll'>
                {Object.entries(radios).map(([key, value], index) => (
                  <div key={key} className="tab" onClick={() => handleSelectedKey(key)}>
                    {key}
                  </div>
                ))}
              </div>
              <div className='radio-vertical-scroll'>
                {radios[selectedKey].map((host) => (
                  host.stations.map((station) => (
                    <div className='station' onClick={() => handleSelection(host, station)}> 
                      {station.name} 
                    </div>
                  ))
                ))}
              </div>
            </div>
          )}
      
          <div style={{visibility: "hidden"}}>
            <audio ref={audioRef} controls><source /></audio>    
          </div>
        </div>
      );
      
}

export default RadioTest

