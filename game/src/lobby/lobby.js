import socket from '../socket';
import './lobby.css';

socket.on('room-start', (roomName) => {
    socket.room = roomName;
    destroyLobby();
});

socket.on('room-ok', () => {
    const errorRef = document.getElementById('error');
    errorRef.style.display = 'none';
    showLoading();
});

socket.on('room-failed', (err) => {
    const errorRef = document.getElementById('error');
    errorRef.style.display = 'initial';
    errorRef.innerText = err;
});

const soundTrack = new Audio('./assets/soundtrack.mp3');
const clickAudio = new Audio('./assets/click.mp3');
const successAudio = new Audio('./assets/Success1.mp3');

const roomNameRef = document.getElementById('room-name');
const createButtonRef = document.getElementById('create-button');
const joinButtonRef = document.getElementById('join-button');

soundTrack.play();

createButtonRef.onclick = () => {
    const roomName = roomNameRef.value;
    if (!roomName){
        return;
    }

    socket.emit('create-room', roomName);
    clickAudio.play();
}

joinButtonRef.onclick = () => {
    const roomName = roomNameRef.value;
    if (!roomName) {
        return;
    }

    socket.emit('join-room', roomName);
    clickAudio.play();
}

function showLoading() {
    const loading = document.getElementById('loading');
    const form = document.getElementById('form');

    form.parentNode.removeChild(form);
    loading.style.display = "flex";
}

function destroyLobby() {
    const lobby = document.getElementById("lobby");
    lobby.parentNode.removeChild(lobby);
    successAudio.play();
}