const WebSocket = require('ws');

module.exports = (server) => {
    const webSocketServer = new WebSocket.Server({ server });
    let callbacks = {};

    webSocketServer.on('connection', (socket) => {
        socket.on('message', (message) => {
            let data;
            try {
                data = JSON.parse(message);
            } catch (ex) {
                return;
            }
            if (!data.name || !callbacks[data.name]) {
                return;
            }
            callbacks[data.name](socket, data.body);
        });
    });

    return {
        on: (name, callback) => {
            callbacks[name] = callback;
        },
        send: (to, name, body) => {
            to.send(JSON.stringify({
                name: name,
                body: body
            }));
        },
        remove: (name) => {
            delete callbacks[name];
        }
    };
};