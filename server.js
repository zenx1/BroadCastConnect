'use strict';
var express = require('express');
var app = express();
var server = require('http').Server(app);
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const wss = new WebSocket.Server({ server });
app.use(express.static('views'));

var socketQueue = {};
wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        var messageObject;
        try {
            messageObject = JSON.parse(message);
        } catch (ex) {
            return;
        }
        if (messageObject.fromWebPage) {
            var uuid = uuidv4();
            socketQueue[uuid] = ws;
            ws.send(JSON.stringify({ uuid: uuid }));
        } else if (messageObject.fromMobileApp) {
            if (!socketQueue[messageObject.uuid]) {
                return;
            }
            socketQueue[messageObject.uuid].send(JSON.stringify({ url: messageObject.url }));
            delete socketQueue[messageObject.uuid];
        }
    });
});


app.set('port', process.env.PORT || 1337);
var server = server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
