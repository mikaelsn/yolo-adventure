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
		socket,	// For socket.io
		balls;  


/**************************************************
** Main init
**************************************************/
function init() {
	// Connect the server
	socket = io.connect("http://localhost", {port: 8080, transports: ["websocket"]});

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
	balls = [];

	// Events
	beginEvents();
}

/**************************************************
** Events
**************************************************/
var beginEvents = function () {
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);
	window.addEventListener("click", newLocalBall, false);

	// Define socket events
	socket.on("connect", socketConnect);
	socket.on("new", newPlayer);
	socket.on("remove", removePlayer);
	socket.on("move", movePlayer);
	socket.on("newBall", newBall);
  socket.on("setthrower", gotBurned);
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

function gotBurned(data) {
    console.log("got burned");
    local.setThrower(true);
    local.setX(10);
    local.setY(10);
	socket.emit("move", {x: local.getX(), y: local.getY()})
}

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

function newBall (data) {
	console.log("got tx: " + data.tx + " ty: " + data.ty + " x: " + data.x + " y: " + data.y);
	var newBall = new Ball(data.x, data.y, data.tx, data.ty);
	newBall.id = data.id;
	balls.push(newBall);
}

function newLocalBall (data) {
    if(local.getThrower()) { 
    	socket.emit("newBall", {x: local.getX(), y: local.getY(), tx: data.pageX, ty: data.pageY});
    };
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

function findByBall(id) {
	for (i = 0; i < balls.length; i++) {
		if (balls[i].id == id)
			return balls[i];
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

function checkCollision(ballRadius, ballX, ballY, playerX, playerY) {
    ballDist = Math.pow((ballX - playerX), 2) + 
                    Math.pow((ballY - playerY), 2);
    return ballDist <= Math.pow(ballRadius, 2);
}

function update() {
	if(local.update(keys)) {
		socket.emit("move", {x: local.getX(), y: local.getY()})
	}

	for (var i = 0; i < balls.length; i++) {
		balls[i].update();
        var x = balls[i].getX();
        var y = balls[i].getY();
        
        // Check for burned players
    	for (var j = 0; j < others.length; j++) {
            if(checkCollision(17, x, y, others[j].getX(), others[j].getY())) {
                socket.emit("burned", { id: others[j].id });
            }
        }

        // Ball out of map bounds, removing
        if(x < 0 || y < 0 || x > 640 || y > 480) {
            balls.splice(i, 1);
        }
	};
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

	for (var i = 0; i < balls.length; i++) {
		balls[i].draw(ctx);
	};
	
	local.draw(ctx);
}
