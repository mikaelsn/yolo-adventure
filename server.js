var util = require("util"),
    fs = require("fs"),
    game = require("http").createServer(httpHandle),
    io = require("socket.io"),
    Player = require("./Player").Player,
    Ball = require("./Ball").Ball;

var socket,
    players,
    balls;

game.listen(8080);

function httpHandle (req, res) {
    fs.readFile(__dirname + "/public/" + req.url, function (err,data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
    });
};




function init() {
    players = [];
    balls = [];

    socket = io.listen(game);

    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });

    beginEvents();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var beginEvents = function() {
    socket.sockets.on("connection", socketConnect);
};

function socketConnect(client) {
    client.on("disconnect", onClientDisconnect);
    client.on("new", onNewPlayer);
    client.on("move", onMovePlayer);
    client.on("newBall", onNewBall);
    client.on("burned", onBurn);
};

function onBurn(data) {

};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);

    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove", {id: this.id});
};

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    // Broadcast new player to connected socket clients
    this.broadcast.emit("new", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    // First player thus becomes thrower
    if(players.length == 0) {
        console.log("first player");
        this.emit("setthrower", { id: this.id })
    }
    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };
        
    players.push(newPlayer);
};

function onNewBall (data) {
    var newBall = new Ball(data.x, data.y, data.tx, data.ty);
    newBall.id = this.id;

    this.broadcast.emit("newBall", {id: newBall.id, x: newBall.getX(), y: newBall.getY(), tx: newBall.getTx(), ty: newBall.getTy()});
    this.emit("newBall", {id: newBall.id, x: newBall.getX(), y: newBall.getY(), tx: newBall.getTx(), ty: newBall.getTy()});
    balls.push(newBall);
}

function onMovePlayer(data) {
    // Find player in array
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit("move", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };
    return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();
