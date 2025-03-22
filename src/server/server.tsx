// REAL TIME COMMUNICATION - IN CHATROOMS OR LOBBY - TODO REMOVE EXPRESS FROM HERE LATER
// For future edits, if you need to change when a userOnline is marked as online, ctr+f and search for * for fast editing,
import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Enable CORS for all routes in Express
app.use(cors({
  origin: 'http://localhost:5173', // Frontend's origin
}));

const server = http.createServer(app);

// Setting up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend's origin
  }
});

interface User {
    socketUid: string;
    userId: number;
    currentPoseIndex: number;
}

interface Room {
    id: string;
    title: string;
    capacity: number;
    activity: string;
    users: number;
    userData: User[];
    // TODO add join URL and others later
}

// online users are defined by users who are inside in a server
interface OnlineUsers {
    [socketId: string]: string;
}

const rooms: Record<string, Room> = {};
const onlineUsers: OnlineUsers = {};

// initiating
io.on('connection', (socket: Socket) => {
    //load rooms:
    socket.on('getRooms',() => {
        socket.emit('updateRooms', Object.values(rooms));
    });
    // helper function for leaving a room:
    const leaveRoom = (roomId:string) => {
        const currentRoomId = onlineUsers[socket.id];
        if(currentRoomId && currentRoomId !== roomId){
            delete onlineUsers[socket.id]; // * remove user from online users list 
            socket.leave(currentRoomId); // disconnect from the room
            const count = rooms[currentRoomId].users - 1; //decrement the count of users in the room
            if(count === 0){ // delete the room if the room has 0 users
                delete rooms[currentRoomId];
            }
        }
    }
    // Room creation 
    socket.on('createRoom', (roomData: { title:string, capacity: number, activity: string}, userJoined: User) => {
        try{
            const roomId = uuidv4();
            const room : Room = {
                id: roomId,
                title: roomData.title,
                capacity: roomData.capacity,
                activity: roomData.activity,
                users: 1,
                userData: [userJoined],
            };
    
            rooms[roomId] = room; // add the room 
            onlineUsers[socket.id] = roomId; // * map user to the room they're in 
    
            socket.join(roomId); // finally attempt to join

            socket.emit('roomCreated', room); //return the created room

            // TODO updateRooms

        }catch(error){
            socket.emit('createError', {message: `Error creating a room: ${error}`});
        }
    });
    
    // joinRoom 
    socket.on('joinRoom', (roomId: string, userJoined:User)=>{
        // if user exists in a room already, remove them:
        leaveRoom(roomId);
        const room = rooms[roomId];
        // cases where the requested room has max capacity, doesnt exist or exists
        if(!room){
            socket.emit('joinError', {message: 'The room does not exist'})
            console.log('room is missing')
        }else if(room.users >= room.capacity){
            socket.emit('joinError', {message: 'The room is full, try again later.'})
            console.log('room is full')
        }else if(roomId === onlineUsers[socket.id]){
            socket.emit('joinError', {message: 'You already entered this room.'})
            console.log('room already in room')
        }else{
            try{
                console.log('joining..')
                room.users += 1;
                room.userData.push(userJoined);
    
                socket.join(roomId); // join server
    
                io.to(roomId).emit('userJoined', userJoined); // notify others in that room who joined
    
                onlineUsers[socket.id] = roomId; // * mention that the user is online 

                socket.emit('roomJoined', room); // send the room data back to user
    
                // TODO optional, update for all users the room data.

            }catch(error){
                socket.emit('joinError', {message: `Error joining the room: ${error}`});
                console.log(error);
            }
        }
    });
    // handle messages being sent
    socket.on('sendMessage', ({roomId, sender, message}:{roomId: string, sender: string, message: string}) => {
        socket.to(roomId).emit('receiveMessage', {sender, message}); // update others about the message being sent
    });
    // exit room and mark as offline 
    socket.on('exitRoom' , (roomId:string)=> {
        leaveRoom(roomId);
        // TODO update the roomdata
    });
    // exit entirely 
    socket.on('disconnect', () => {
        try{
            const roomId = onlineUsers[socket.id]; // if user is in a room and disconnecting
            if(roomId){
                leaveRoom(roomId);
            }
            console.log(`User ${socket.id} disconnected`);
        }catch(error){
            console.log('Error disconnecting ',error);
        }
    })
});


const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});