const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 5000;

app.get('/', (req, res) => {
    return res.send("Hello Amiral Kalktı");
});

io.on('connection', (socket) => {
    socket.on('create-room', (roomName) => {
        const clients = io.sockets.adapter.rooms[roomName];
        if (clients && clients.length){
            socket.emit('room-failed');
            return;
        }

        socket.join(roomName, () => {
            socket.emit('room-ok');
        });
    });

    socket.on('join-room', (roomName) => {
        const clients = io.sockets.adapter.rooms[roomName];
        if (!clients || clients.length !== 1){
            socket.emit('room-failed');
            return;
        }

        socket.join(roomName, () => {
            socket.emit('room-ok');
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