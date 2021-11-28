const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router)
app.use(cors());

io.on('connect', (socket) => {
    // console.log('we have a new connection...');
    socket.on('join', ({ name, room }, callback) => {
        // console.log(name, room);
        const { error, user } = addUser({ id: socket.id, name: name, room: room });

        if(error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name} Welcome to the room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined.`});
        
        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

        callback();
    });

    socket.on('sendMessage', (message, callBack) => {
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

        callBack();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left...`})
        }
    });
})

app.use(router);

server.listen(PORT, () => console.log(`server has started on port: ${PORT}`))