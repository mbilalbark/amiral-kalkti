import socket from '../socket';
import './lobby.css';

socket.on('room-start', () => {
    destroyLobby();
});

socket.on('room-ok', () => {
    showLoading();
});

socket.on('room-failed', (err) => {
    const errorRef = document.getElementById('error');
    errorRef.style.display = 'initial';
    errorRef.innerText = err;
});

const clickAudio = new Audio('./assets/click.mp3');
const successAudio = new Audio('./assets/Success1.mp3');

const roomNameRef = document.getElementById('room-name');
const createButtonRef = document.getElementById('create-button');
const joinButtonRef = document.getElementById('join-button');

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