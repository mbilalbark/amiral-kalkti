const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 5000;

app.use(express.static('game/dist'));

app.get('/', (req, res) => {
    return res.sendFile('game/dist/index.html');
});

io.on('connection', (socket) => {
    socket.on('create-room', (roomName) => {
        const clients = io.sockets.adapter.rooms[roomName];
        if (clients && clients.length){
            socket.emit('room-failed', 'Room already exists!');
            return;
        }

        socket.join(roomName, () => {
            socket.emit('room-ok');
        });
    });

    socket.on('join-room', (roomName) => {
        const clients = io.sockets.adapter.rooms[roomName];
        if (!clients){
            socket.emit('room-failed', 'Room not found!');
            return;
        }

        if (!clients.length > 1){
            socket.emit('room-failed', 'Room is full!');
            return;
        }


        socket.join(roomName, () => {
            io.to(roomName).emit('room-start');
        });
    });

    socket.on('start', () => {
        Object.keys(socket.rooms).forEach(room => {
            const clients = io.sockets.adapter.rooms[room];
            if (!clients || clients.length < 2){
                return;
            }

            io.to(room).emit('start');
        });
    });

    /**
     * 
     * {
     *   "player" : string
     *   "room" : string
     *   "target" : array // etc [3,5]
     * }
     * 
     */
    socket.on('fire', (data) => {
        io.to(data.room).emit('fire', data);
    });

    /**
     * 
     * {
     *   "player": string,
     *   "room" : string,
     *   "success": boolean
     * }
     * 
     */
    socket.on('response', (data) => {
        io.to(data.room).emit('response', data);
    });

    socket.on('disconnecting', () => {
        Object.keys(socket.rooms).forEach(room => {
            socket.leave(room, () => {
                io.to(room).emit('finished');
            });
        });
    });
});


http.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});