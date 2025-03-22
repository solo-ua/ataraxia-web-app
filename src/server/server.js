import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Enable CORS for all routes in Express
app.use(cors({
  origin: 'http://localhost:5173', // Frontend's origin
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true // If you're dealing with cookies, sessions, etc.
}));

const server = http.createServer(app);

// Setting up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend's origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});


const rooms = {
}; // In-memory storage for rooms
const onlineUsers = {} // To track which users are in which rooms

io.on('connection', (socket) => { 
  //FIXME fix this
  console.log('Connected', socket.id); 
  // Emit the room list when a client connects
  socket.on('getRooms', () => {
    socket.emit('updateRooms', Object.values(rooms)); // Send rooms to the client that requested it  
  });

  const leaveRoom = (roomId) => { 
    const currentRoomId = onlineUsers[socket.id];
    if (currentRoomId && currentRoomId !== roomId) {
      // Leave the current room
      socket.leave(currentRoomId);
      rooms[currentRoomId].users -= 1;

      // Remove the room if empty
      if (rooms[currentRoomId].users === 0) {
        delete rooms[currentRoomId];
      }}
   }

  // Track user once they are connected
  socket.on('joinRoom', (roomId, userJoined) => { 
    // If user is already in a room, remove them from it
      leaveRoom(roomId);
      if (!rooms[roomId]) {
        socket.emit('joinError', { message: 'Room does not exist.' });
      } else if (rooms[roomId].users >= rooms[roomId].capacity) {
        socket.emit('joinError', { message: 'The room is full.' });
      } else if (onlineUsers[socket.id] === roomId) {
        socket.emit('joinError', { message: 'You are already in this room.' });
        // todo disable the join button or remove this room from the list
      }else{
        onlineUsers[socket.id] = roomId; // adding socket to that room
        console.log(onlineUsers);
        rooms[roomId].users += 1; // adding capacity
        const usersInServer = rooms[roomId].userData;
        rooms[roomId].userData.push(userJoined);
        
        socket.join(roomId);
        // Notify everyone else in the room
        io.to(roomId).emit('userJoined', userJoined);
        console.log(`Emitting userJoined to room ${roomId} with data:`, userJoined);//this data goes to the people who are already in the room

        socket.emit('roomJoined',rooms[roomId])  // this data goes to the joiner
        // so that their side of the component can render other's avatars at different poses

        // console.log(`User joined the room: ${rooms[roomId].title}`);
      }
      io.emit('updateRooms', Object.values(rooms)); // Emit updated list. Object.values(rooms): This retrieves all the values from the rooms object.  
   })

   socket.on('poseChanged', (roomId, newPose) => {
    console.log(rooms[roomId].userData);
  
    // Find and update the user in the room
    const updatedUser = rooms[roomId].userData.find(user => user.socketUid === socket.id);
    if (updatedUser) {
      updatedUser.currentPose = newPose; //POSE INDEX
      console.log(newPose);
      // potential issues!!!!!!!!!!!!!!!!!!!!!!!!!!! you may not be updating the OG rooms[roomId] with new pose
      // Notify others in the room about the pose change
      socket.broadcast.to(roomId).emit('updatePose', updatedUser);
    } else {
      console.error(`User with socket ID ${socket.id} not found in room ${roomId}`);
    }
  });
  socket.on('sendMessage', ({ roomId, sender, message }) => {
    console.log('Received message:', roomId, sender, message); // Debug log
    socket.to(roomId).emit('receiveMessage', { sender, message });
  });
  // Room Creation
 socket.on('createRoom', (roomData, userJoined) => {
  const roomId = uuidv4();
  console.log(userJoined);
  // If user is already in a room, remove them from it  
  leaveRoom(roomId);
  const room = {
    id: roomId,
    title: roomData.title,
    capacity: roomData.capacity,
    activity: roomData.activity,
    users: 1,
    userData: [userJoined], //data of each user such as their states
    joinUrl: `http://localhost:5173/join/${roomId}`,
    url: '/path/to/room.glb',
  };
  socket.join(roomId);
  onlineUsers[socket.id] = roomId; // Specify that the user is now in the new server
  rooms[roomId] = room; // Add room to in-memory list
  socket.emit('roomCreated', room);
  io.emit('updateRooms', Object.values(rooms)); // Emit updated list. Object.values(rooms): This retrieves all the values from the rooms object.  
});
// socket.on('loadingAv', (roomId, me ) => { 
//   console.log('UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUh', roomId);
//   io.in(roomId).emit('userJoined', {
//     roomId: roomId,
//   });
//  })

/*
  NOTE
  rooms is a dictionary (an object) where each key is a room ID and each value is an object representing the room 
  (including its title, capacity, and other details). 
  
  Object.values(rooms) converts this dictionary into an array of room objects, 
  which can then be easily sent to the clients.
*/ 

// Room exit
socket.on('exitRoom', (roomId) => {
  if (rooms[roomId]) {
    onlineUsers[socket.id] = null;
    rooms[roomId].users -=1; 
    // Remove room if empty:
    if(rooms[roomId].users===0){
      delete rooms[roomId];
    }
    socket.emit('updateRooms', Object.values(rooms)); // Emit updated list. Object.values(rooms): This retrieves all the values from the rooms object.  
  }
});

socket.on('disconnect', () => {
  try{
    const roomId = onlineUsers[socket.id]; // Get the room ID from the onlineUsers map

    if (roomId) {
      console.log(`Room ID detected: ${roomId}`);
      rooms[roomId].users -= 1;  // Decrease user count in the room
      // Remove the user from onlineUsers since they disconnected
      delete onlineUsers[socket.id];  

      if(rooms[roomId].users === 0){ // If room is empty, remove it 
        delete rooms[roomId];
      }

    } else {
      console.log(`No room found for user ${socket.id}`);
    }
  } catch (e) {
    console.error(`Error handling disconnection for socket ${socket.id}:`, e);
  }
  socket.emit('updateRooms', Object.values(rooms)); // Emit updated list. Object.values(rooms): This retrieves all the values from the rooms object.  
  console.log(`User ${socket.id} disconnected`);
});
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});