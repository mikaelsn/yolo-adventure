//XSockets API-Key Example
var xsLiveAccount = {
    apikey: '5f3928ab-76e2-484f-8ab4-97266f272c8d'
};
var ws = null;
var xHandler = "XSockets.Live.Realtime.API";
var wsUri = "ws://xsocketslive.cloudapp.net:10101/" + xHandler;

$(function() {

    // Create an instance of the Generic WebSocket Handler of XSockets
    ws = new XSockets.WebSocket(wsUri, xHandler, xsLiveAccount);
    //Listen for the open event
    ws.bind(XSockets.Events.open, function() {
        ws.bind('newMessage', function(data) {
            $('#realtimedata').prepend($('<div>').text(data.Message));
        });
    });

    $("button").bind("click", function() {
        ws.trigger('newMessage', {
            Message: $("#message").val()
        });
        $("#message").val('');
    });
});