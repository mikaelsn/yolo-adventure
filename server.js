var util = require("util"),
    fs = require("fs"),
    game = require("http").createServer(httpHandle),
    io = require("socket.io"),
    Player = require("./Player").Player;

var socket,
    players;

game.listen(parseInt(process.env.port));

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




/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    // Create an empty array to store players
    players = [];

    // Set up Socket.IO to listen on port 8000
    socket = io.listen(game);

    // Configure Socket.IO
    socket.configure(function() {
        // Only use WebSockets
        socket.set("transports", ["websocket"]);

        // Restrict log output
        socket.set("log level", 2);
    });

    // Start listening for events
    beginEvents();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var beginEvents = function() {
    // Socket.IO
    socket.sockets.on("connection", socketConnect);
};

// New socket connection
function socketConnect(client) {
    // Listen for client disconnected
    client.on("disconnect", onClientDisconnect);

    // Listen for new player message
    client.on("new", onNewPlayer);

    // Listen for move player message
    client.on("move", onMovePlayer);
};

// Socket client has disconnected
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);

    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
    // Create a new player
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    // Broadcast new player to connected socket clients
    this.broadcast.emit("new", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };
        
    // Add new player to the players array
    players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
    // Find player in array
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
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
