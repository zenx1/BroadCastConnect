const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });
    let callbacks = {};

    wss.on('connection', function connection(ws) {
        ws.on('message', function (message) {
            var messageObject;
            try {
                messageObject = JSON.parse(message);
            } catch (ex) {
                return;
            }
            if (!messageObject.title || !callbacks[messageObject.title]) {
                return;
            }
            callbacks[messageObject.title](ws, messageObject.body);
        });
    });

    return {
        on: (title, callback) => {
            callbacks[title] = callback;
        },
        send: (to, title, body) => {
            to.send(JSON.stringify({
                title: title,
                body: body
            }));
        },
        remove: (title) => {
            delete callbacks[title];
        }
    };
};