import * as PIXI from 'pixi.js';
import socket from './socket';
import './index.css';
// import './lobby/lobby';

const app = new PIXI.Application({
    width: window.innerWidth,
	height: window.innerHeight,
    backgroundColor:16777215	
})

document.body.appendChild(app.view) 
const container = new PIXI.Container();

app.stage.addChild(container);
socket.on('room-start', () => {
    Start();
});

Start();

function Start(){
 
    const oneShipText = PIXI.Texture.from('assets/1.png');
    const twoShipText = PIXI.Texture.from('assets/2.png');
    const threeShipText = PIXI.Texture.from('assets/3.jpeg');

    createShips(200,200, oneShipText);
    createShips(50,100, twoShipText);
    createShips(50,200, threeShipText);
    leftMapGenerate();
    rightMapGenerate(); 
}

function leftMapGenerate() {

    let rootX = 200;
    let rootY = 200;

    for(let i = 0; i<10;i++){
        for(let j =0;j<10;j++){
            const squareTexture = PIXI.Texture.from('assets/sq.png');
            const sq = new PIXI.Sprite(squareTexture)
            sq.height = 50;
            sq.width = 50;
            sq.position.x = rootX;
            sq.position.y = rootY;
            container.addChild(sq);
            rootX +=50;
        }
        rootX=200;
        rootY +=50;
	}
}

function rightMapGenerate() {

    let rootX = 1100;
    let rootY = 200;

    for(let i = 0; i<10;i++){
        for(let j =0;j<10;j++){
            const squareTexture = PIXI.Texture.from('assets/sq.png');
            const sq = new PIXI.Sprite(squareTexture)
            sq.height = 50;container
            sq.width = 50;
            sq.position.x = rootX;
            sq.position.y = rootY;
            container.addChild(sq);
            rootX +=50;
        }
        rootX=1100;
        rootY +=50;
	}
}

function createShips(x, y,texture)
{
    // create our little bunny friend..
    var ship = new PIXI.Sprite(texture);
	ship.scale
    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    ship.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    ship.buttonMode = true;

    // center the bunny's anchor point
    ship.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    ship.height =80;
    ship.width = 150;

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
    ship.position.x = x;
    ship.position.y = y;

    // add it to the stage
    container.addChild(ship);
    return ship;
}
// Colider
function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
  
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
  
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    //`hit` will be either `true` or `false`
    return hit;
  };


function onDragStart(event)
{
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        console.log(this.parent)
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
