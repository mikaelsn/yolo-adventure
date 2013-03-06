var game = require("http").createServer(httpHandler)
var io = require("socket.io").listen(game)
var fs = require("fs")

game.listen(8080);

        
function httpHandler(request, response) {
    fs.readFile(__dirname + "/index.html", function(error, contents) {
        if(error) {
            response.writeHead(404);
            return response.end("Index not found");
        }
        response.writeHead(200);
        response.end(contents);        
    });

    response.writeHead(200, { "Content-Type": "text/plain"});
    response.end("test");
};

io.sockets.on("connection", function (socket) {
        socket.emit('test', { hello: 'world' });
});
