import io from 'socket.io-client';

// TODO : Set this url as dynamically for deployment
const socket = io('127.0.0.1:5000');

export default socket;