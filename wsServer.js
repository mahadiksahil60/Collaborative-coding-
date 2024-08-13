const  { Server } = require('socket.io')
const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

app.get('/', (req, res)=>{
    res.send("hello from socket server")
})

const rooms = new Set();  


io.on('connection', (socket)=>{

console.log("new user connected", socket.id);

//listerner to handle createRoom
socket.on('createRoom', (roomName)=> {
if(rooms.has(roomName)){
    socket.emit('roomcreateerror', {message : "The room already exists choose another name"})
}else{
    rooms.add(roomName);
    socket.join(roomName);
    console.log(`room created by ${socket.id}`, roomName);
    socket.emit('roomCreated', { roomName })
}
})

//listener to handle joining in room
socket.on('joinRoom', (roomName)=> {
    if(rooms.has(roomName)){
    socket.join(roomName);
    console.log(`room joined by ${socket.id}`, roomName);
    socket.emit('roomJoined', { roomName })
    }else{
        socket.emit('roomjoinerror', {message: "No such room exists"})
    }
})

socket.on('leaveRoom', (roomName)=>{
    console.log("user disconnected from this room", roomName)
    socket.leave(roomName);
    rooms.delete(roomName);
    socket.emit('roomLeft', {roomName})
})

//handling propogation of code changes
socket.on('codeChange', (data)=>{
    console.log('Received code changes :',data.roomName, data.message)
    socket.to(data.roomName).emit('changedcode',{message : data.message});
})
//handling propogation of input changes
socket.on('inputChange', (data)=>{
    console.log('Received input changes :',data.roomName, data.message)
    socket.to(data.roomName).emit('newinput', {message : data.message});
})
//handling propogation of output changes
socket.on('outputChange', (data)=>{
    console.log('Received output changes :',data.roomName, data.message)
    socket.to(data.roomName).emit('newoutput',{message : data.message});
})

socket.on('disconnect', ()=>{
    console.log("client disconnected", socket.id)
})  
})

const PORT = 3001;
server.listen(PORT,()=>{
    console.log(`The web socket server has been initialized on ${PORT}`)
})

// socket.on('codeChange', (data)=>{
//     console.log('Received code change :',data)
//     socket.broadcast.emit('codeChange',data);
// })
