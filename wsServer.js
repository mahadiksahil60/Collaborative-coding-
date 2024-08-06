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

io.on('connection', (socket)=>{

console.log("new user connected", socket.id);

//listerner to handle createRoom
socket.on('createRoom', (roomName)=> {
    socket.join(roomName);
    console.log(`room created by ${socket.id}`, roomName);
    socket.emit('roomCreated', { roomName })
})

//listener to handle joining in room
socket.on('joinRoom', (roomName)=> {
    socket.join(roomName);
    console.log(`room joined by ${socket.id}`, roomName);
    socket.emit('roomJoined', { roomName })
})

//handling propogation of code changes
socket.on('codeChange', (data)=>{
    console.log('Received code changes :',data.roomName, data.message)
    socket.to(data.roomName).emit('codeChange',{message : data.message});
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
