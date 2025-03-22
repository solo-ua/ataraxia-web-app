import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { joinRoom } from '../redux/actions/server-actions';
import '../style/server-browser.css'
import Room3D from './testRoom';
import socket from '../socket.js'
import InServerOverlay from './minor-components/overlay-inServer-component.jsx';
import CreateServer from './minor-components/create-room.jsx';
import PopUpModular from './minor-components/popUpWindow.jsx';
import ServerInfo from './minor-components/server-info-popup.jsx';

const Servers = () => {
  const [rooms, setRooms] = useState([]);
  const inServerSettings = useSelector((state) => state.inServer);
  const userSettings = useSelector((state) => state.user);
  const [currentRoom, setCurrentRoom] = useState(null); // Track the joined room
  const [usersInRoom, setUsersInRoom] = useState([]); // Track users in the room
  const [popUp, showPopUp] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState({state:false,roomData:null});
  const dispatch = useDispatch();

  const userData = ({
    socketUid: socket.id,
    id: userSettings.id,
    username: userSettings.username,
    nickname: userSettings.nickname,
    about: userSettings.about,
    dateJoined: userSettings.dateJoined,
    status: inServerSettings.status,
    radio: inServerSettings.radio,
    tasks: inServerSettings.serverSettings.tasks,
    currentAvatar: '/seriousTestAvatar.glb',
    currentPose: null,

  });
  useEffect(() => {
    return () => {
    };
  }, []);

  useEffect(() => {
    socket.emit('getRooms');
    const intervalId = setInterval(() => socket.emit('getRooms'), 900000);

    socket.on('updateRooms', (rooms) => {
      console.log('Updating rooms list');
      setRooms(rooms); // Update the rooms state
    });

    return () => {
      clearInterval(intervalId);
      socket.off('updateRooms');
    };
  }, []);

  const callBackCreateServer = (roomData) => { 
    socket.emit('createRoom', roomData, userData); //current userdata 
    socket.on('roomCreated', (room) => {
        const myRoom = { ...room }; // take A COPY of the object not the pointer
        myRoom.userData = []; //ensure this is empty so it doesnt mark me as 'other user in server' (for overlay component)
        dispatch(joinRoom(myRoom)); // Update global state
        setCurrentRoom(room);
      });
   }

  const handleCreateRoom = () => {
    showPopUp(true);
    // const roomData = {
    //   title: name,
    //   capacity: 5,
    //   activity: 'Chat',
    // };
    // socket.emit('createRoom', roomData, userData); //current userdata

    socket.on('roomCreated', (room) => {
      const myRoom = { ...room }; // take A COPY of the object not the pointer
      myRoom.userData = []; //ensure this is empty so it doesnt mark me as 'other user in server' (for overlay component)
      dispatch(joinRoom(myRoom)); // Update global state
      setCurrentRoom(room);
    });
  };

  const handleJoin = (room) => {
    socket.emit('joinRoom', room.id, userData);
    socket.on('roomJoined', ({ roomId, userData: usersInServer }) => {
      // setUsersInRoom(usersInServer); // Set the list of users in the room
      dispatch(joinRoom(room)); // Update global state
      setCurrentRoom(room); // Set the current room
    });
  };

  return (
    <div id='public-rooms'>
      {currentRoom ? ( // If a room is joined, show the 3D room
      <div style={{ display:'flex', width: '100%', height: '100%' }}>
        <InServerOverlay />
        <Room3D roomData={currentRoom} />
      </div>
      ) : (
        <div className='servers'>
          <h1 className='joinopenrooms'>Public Rooms</h1>
          {/* CREATE A ROOM BUTTON */}
          <button className='createRoom-btn' onClick={handleCreateRoom}>Create Room</button>
          <PopUpModular isOpen={popUp} onClose={() => showPopUp(false)}>
           <CreateServer callback={callBackCreateServer} />
          </PopUpModular>

          {/* SHOW ROOM DETAILS WHEN CLICKED */}
          <PopUpModular isOpen={showRoomInfo.state } onClose={() => setShowRoomInfo({state:false,roomData:null})}>
            <ServerInfo roomData={showRoomInfo.roomData} callback={handleJoin} />
          </PopUpModular>
          
          
          {/* DISPLAY AVAILABLE ROOMS */}
          <div className="rooms">
            {rooms.map((room) => (
                <div className="room" key={room.id} onClick={() => { setShowRoomInfo({state: true, roomData: room}) }}>
                <div className="room-preview" style={{ backgroundImage: 'url(https://picsum.photos/200)' }}></div>
                <h3 className="room-title">{room.title}</h3>
                {/* <h3 className="room-activity">{room.activity}</h3> */}
                <div className="room-capacity">
                {room.capacity} / {room.users}
                </div>
                {/* <button className="btn-join" onClick={() => handleJoin(room)}>Join</button> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Servers;
