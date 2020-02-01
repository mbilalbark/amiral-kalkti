import * as PIXI from 'pixi.js'
const app = new PIXI.Application({
    width: window.innerWidth,
	height: window.innerHeight,
	
   // resolution: window.devicePixelRatio // For good rendering on mobiles
})
document.body.appendChild(app.view) 
var container = new PIXI.Container();

app.stage.addChild(container);
// var renderer = PIXI.autoDetectRenderer(800, 600);


Start();

function Start(){

	const oneShipText = PIXI.Texture.from('assets/1.png');
	const twoShipText = PIXI.Texture.from('assets/2.png');
	const threeShipText = PIXI.Texture.from('assets/3.jpeg');

	createShips(50,60, oneShipText);
	createShips(50,100, twoShipText);
	createShips(50,200, threeShipText);
	mapGenerate();
}

function mapGenerate() {
	var map = [
		[50, 50],
		[50, 60],
		[50, 70]
	  ];
	for(let i = 0; i<map.length;i++){
		const squareTexture = PIXI.Texture.from('assets/sq.png');
		const sq = new PIXI.Sprite(squareTexture)
		sq.position.x = map[i][0];
		sq.position.y = map[i][1];
		container.addChild(sq);
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
    ship.scale.set(3);

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
}

// requestAnimationFrame( animate );

// function animate() {

//     requestAnimationFrame(animate);

//     // render the stage
//     renderer.render(stage);
// }

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
