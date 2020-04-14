const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { addUser, removeUser, getUser, getUserInRoom } = require('./users');
const PORT = process.env.port || 5000;

const router = require('./router');

const App = express();
const Server = http.createServer(App);
const io = socketio(Server);

io.on('connection', (socket) => {
    console.log('We have a new Connection!!!');

    socket.on('join', ({ name, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, name, room });


        if (error) {
            return (callback(error));
        }
        //console.log(user);
        socket.emit('message', { user: 'admin', text: ' ' + user.name + ', welcome to the room ' + user.room + '.' });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: '' + user.name + ', has joined the room ' + user.room + '.' });
        socket.join(user.room);
        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room) });
        callback();

    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room) });
        callback();
    });


    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` })
        }
    });
}

);

App.use(router);

Server.listen(PORT, () => console.log('Server us Running Sree (%o is the port) ', PORT));