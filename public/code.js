window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(callback, element){
        window.setTimeout(callback, 1000 / 60);
    };
})();

var canvas,	// DOM
		ctx,		// Context
		keys,		// Keyboard
		local,	// Me
		others,	// Other players
		socket;	// For socket.io


/**************************************************
** Main init
**************************************************/
function init() {
	// Connect the server
	socket = io.connect("yolo-adventure.azurewebsites.net", {port: 8000, transports: ["websocket"]});

	// Init keys
	keys = new Keys();

	// Get canvas from the DOM
	canvas = $('#yolo')[0];
	ctx = canvas.getContext('2d');

	// Canvas size
	canvas.width = 640;
	canvas.heigth = 480;

	// Initialise players
	var x = 320;
	var y = 240;
	local = new Player(x, y);
	others = [];

	// Events
	beginEvents();
}

/**************************************************
** Events
**************************************************/
var beginEvents = function () {
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Define socket events
	socket.on("connect", socketConnect);
	socket.on("new", newPlayer);
	socket.on("remove", removePlayer);
	socket.on("move", movePlayer);
}

// Keyboard key down
function onKeydown(e) {
	if (local) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (local) {
		keys.onKeyUp(e);
	};
};


/**************************************************
** Socket events
**************************************************/
function socketConnect () {
	socket.emit("new", {x: local.getX(), y: local.getY()});
}

function newPlayer (data) {
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	others.push(newPlayer);
}

function removePlayer (data) {
	var remove = findById(data.id);
	others.splice(others.indexOf(remove), 1);
}

function movePlayer (data) {
	var moveThis = findById(data.id);

	if(!moveThis){
		return; // Player not found
	}

	moveThis.setX(data.x);
	moveThis.setY(data.y);
}

function findById(id) {
	for (i = 0; i < others.length; i++) {
		if (others[i].id == id)
			return others[i];
	}
}

/**************************************************
** Loop
**************************************************/
function process() {
	update();
	draw();
	window.requestAnimFrame(process);
}


/**************************************************
** Local update and drawing
**************************************************/
function update() {
	if(local.update(keys)) {
		socket.emit("move", {x: local.getX(), y: local.getY()})
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
	ctx.beginPath();
	ctx.arc(300,220,160,0,2*Math.PI); // Draw the gamefloor
	ctx.stroke();

	// Players are drawn in player.js
	for (var i = 0; i < others.length; i++) {
		others[i].draw(ctx);
	}
	
	local.draw(ctx);
}
