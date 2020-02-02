import * as PIXI from 'pixi.js';
import socket from './socket';
import './index.css';
import './modal/modal';
import './lobby/lobby';

const container = new PIXI.Container();
const app = new PIXI.Application({
    width: window.innerWidth,
	height: window.innerHeight,
    backgroundColor:10010111000011110110110	
});

let currentTarget = [];
let allShips = [];
let ownMapSprites = [];
let enemyMapSprites = [];
let currentPlayer = socket.id;
const readyPlayers = [];
const arrowSprite = new PIXI.Sprite(PIXI.Texture.from('assets/right-arrow.png'));
const counter = {
    enemy : 12,
    you : 12
};

socket.on('room-start', () => {
    new Audio('./assets/ocean.wav').play();
    Start();
});

socket.on('ready', (player) => {
    readyPlayers.push(player);

    if (readyPlayers.length < 2){
        return;
    }

    currentPlayer = readyPlayers[0];

    toggleArrowLabel(currentPlayer === socket.id);

    enemyMapSprites = enemyMapSprites.map(sq => {
        sq.interactive = false;
        return sq;
    });

    allShips = allShips.map(ship => {
        ship.interactive = false;
        return ship;
    });
});

socket.on('response', onResponse);
socket.on('fire', onFire);

function Start(){
    app.stage.addChild(container);
    document.body.appendChild(app.view);
    
    buttonCreate();
    upSideGenerate();
    logo();
    createFireLabel();
    createArrowLabel();
    createTitles();

    enemyMapSprites = generateMap(200);
    ownMapSprites = generateMap(1150);

    const oneShipText = PIXI.Texture.from('assets/bigship.png');
    const twoShipText = PIXI.Texture.from('assets/midshipone.png');
    const threeShipText = PIXI.Texture.from('assets/midshiptwo.png');
    const fourShipText = PIXI.Texture.from('assets/smallship.png');

    const ship1 = createShips('ship1', window.innerWidth/2-350 ,100, oneShipText, 200,50,3);
    const ship2 = createShips('ship2', window.innerWidth/2-130,100, twoShipText,150,50,2);
    const ship3 = createShips('ship3', window.innerWidth/2+40,100, threeShipText,150,50,2);
    const ship4 = createShips('ship4', window.innerWidth/2+200,100, fourShipText,100,50,1);

    allShips = [ship1, ship2, ship3, ship4];
}

function generateMap(originalRootX) {
    const sprites = [];
    let rootX = originalRootX;
    let rootY = 200;

    for(let i = 0; i<10;i++){
        for(let j =0;j<10;j++){
            const squareTexture = PIXI.Texture.from('assets/sq.png');
            const sq = new PIXI.Sprite(squareTexture)
            sq.name = [i, j];
            sq.height = 50;
            sq.width = 50;
            sq.position.x = rootX;
            sq.position.y = rootY;
            sq.interactive = true;
            sq.buttonMode = true;
            sq.disabled = false;
            sq
                .on('click', () => {
                    if (sq.disabled || currentPlayer !== socket.id){
                        return;
                    }

                    socket.emit("fire", {
                        player: socket.id,
                        room: socket.room,
                        target: sq.name
                    });
                })
                .on('mouseover', (event) => {
                    currentTarget = sq.name;
                })
                .on('mouseout', (event) => {
                    if (event.target === null){
                        currentTarget = [];
                    }
                });

            sprites.push(sq);
            container.addChild(sq);
            rootX +=50;
        }
        rootX = originalRootX;
        rootY +=50;
    }
    
    return sprites;
}

function createShips(name, x, y, texture, width, height, unit) {
    // create our little bunny friend..
    const ship = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    ship.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    ship.buttonMode = true;

    // center the bunny's anchor point
    ship.anchor.set(0,0.5);

    // make it a bit bigger, so it's easier to grab
    ship.height = height;
    ship.width = width;
    ship.name = name;
    ship.unit = unit;
    // setup events
    ship
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    // move the sprite to its designated position
    ship.position.default = {x, y}
    ship.position.x = x;
    ship.position.y = y;

    // add it to the stage
    container.addChild(ship);
    return ship;
}

function upSideGenerate() {
    const leftSideText = PIXI.Texture.from('assets/frame.png');
    const sideMap = new PIXI.Sprite(leftSideText)
    sideMap.height = 100;
    sideMap.width = 800;
    sideMap.anchor.set(0.5);
    sideMap.position.x = window.innerWidth/2;
    sideMap.position.y = 100;
    container.addChild(sideMap);
}

function buttonCreate() {
    const readyText = PIXI.Texture.from('assets/ready.png');
    const readySprite = new PIXI.Sprite(readyText)
    readySprite.height=100
    readySprite.width=256
    readySprite.anchor.set(0.5)
    readySprite.interactive = true;
    readySprite.buttonMode = true;
    readySprite.on('mouseover', buttonHover)
    readySprite.on('mouseout',buttonOut)
    readySprite.on('click', buttonOnClick)
    readySprite.position.x =  window.innerWidth/2
    readySprite.position.y = 250
    container.addChild(readySprite)
}

function logo() {
    const logoText = PIXI.Texture.from('assets/logo.png');
    const logoSprite = new PIXI.Sprite(logoText)
    logoSprite.anchor.set(0.5)
    logoSprite.height=150
    logoSprite.width=250
    logoSprite.position.x =  window.innerWidth/2
    logoSprite.position.y = 400
    container.addChild(logoSprite)
}

function createFireLabel(){
    const fireText = PIXI.Texture.from('assets/fire.png');
    const fireTextSprite = new PIXI.Sprite(fireText);
    fireTextSprite.height = 100;
    fireTextSprite.width = 256;
    fireTextSprite.anchor.set(0.5)
    fireTextSprite.position.x =  window.innerWidth / 2;
    fireTextSprite.position.y = 600;
    fireTextSprite.alpha = 1;
    container.addChild(fireTextSprite);
}

function createArrowLabel(){
    arrowSprite.height = 100;
    arrowSprite.width = 256;
    arrowSprite.anchor.set(0.5)
    arrowSprite.position.x =  window.innerWidth / 2;
    arrowSprite.position.y = 700;
    arrowSprite.alpha = 0;
    container.addChild(arrowSprite);
}

function createTitles(){
    const enemyTitleSprite = new PIXI.Sprite(PIXI.Texture.from('assets/enemy-title.png'));
    enemyTitleSprite.height = 100;
    enemyTitleSprite.width = 256;
    enemyTitleSprite.anchor.set(0.5)
    enemyTitleSprite.position.x =  300 ;
    enemyTitleSprite.position.y = 100;
    container.addChild(enemyTitleSprite);

    const yourTitleSprite = new PIXI.Sprite(PIXI.Texture .from('assets/you-title.png'));
    yourTitleSprite.height = 100;
    yourTitleSprite.width = 256;
    yourTitleSprite.anchor.set(0.5)
    yourTitleSprite.position.x =  1500;
    yourTitleSprite.position.y = 100;
    container.addChild(yourTitleSprite);
}

function toggleArrowLabel(isCurrentPlayer) {
    arrowSprite.alpha = 1;
    arrowSprite.texture = isCurrentPlayer ? PIXI.Texture.from('assets/right-arrow.png') : PIXI.Texture.from('assets/left-arrow.png');

    ownMapSprites = ownMapSprites.map(sq => {
        sq.interactive = isCurrentPlayer;
        return sq;
    });
}

function buttonHover() {
    const readyHoverText = PIXI.Texture.from('assets/ready-hover.png');
    this.texture = readyHoverText;
}

function buttonOut(){
    const readyText = PIXI.Texture.from('assets/ready.png');
    this.texture = readyText;
}

function buttonOnClick(){
    const droppedShips = allShips.filter(ship => ship.location);
    if (droppedShips.length !== 4){
        return;
    }

    socket.emit('ready', socket.id);
    this.alpha = 0;
}

function onFire(data) {
    if (data.player !== socket.id){
        let success = false
        allShips.forEach(ship => {
                if(ship.location && ship.location[0] === data.target[0]){
                    if(data.target[1] >= ship.location[1] && data.target[1] <= ship.location[1] + ship.unit)
                    success = true;
                }
            })

        socket.emit('response', {
            player: socket.id,
            room: socket.room,
            target : data.target,
            success : success
        });
    }
}

function onResponse(data) {
    const target = data.player === socket.id ? 'you' : 'enemy';
    const list = target === 'you' ? enemyMapSprites : ownMapSprites;
    const sprite = list.find(sq => {
        return sq.name && sq.name[0] === data.target[0] && sq.name[1] === data.target[1];
    });

    if (data.success){
        sprite.disabled = true;
        sprite.texture = PIXI.Texture.from('assets/tick.png');
        sprite.alpha = 0.5;
        counter[target] -= 1;
    } else {
        sprite.disabled = true;
        sprite.texture = PIXI.Texture.from('assets/error.png');
        sprite.alpha = 0.5;
    }

    if (!counter[target]){
        const type = target === 'enemy' ? 'success' : 'danger';
        const modal = document.getElementById(`${type}-modal`);
        modal.style.display = 'block';
        return;
    }

    currentPlayer = readyPlayers.find(player => player !== currentPlayer);
    toggleArrowLabel(socket.id === currentPlayer);
}

function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    this.location = currentTarget;
    if (!currentTarget.length){
        this.position.x = this.position.default.x;
        this.position.y = this.position.default.y;
        return;
    }
}

function onDragMove(event) {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);     
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
