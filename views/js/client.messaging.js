var clientMessaging = function (wsUrl) {
    var socket = new WebSocket(wsUrl);

    var callbacks = {};

    var ensureSocketOpened = (function () {
        var isSocketOpened = false;
        var executeOnSocketOpen = [];

        socket.onopen = function (e) {
            isSocketOpened = true;
            executeOnSocketOpen.forEach(function (onOpened) {
                onOpened();
            });
            executeOnSocketOpen = [];
        };
        return function (onOpened) {
            if (isSocketOpened) {
                onOpened();
            } else {
                executeOnSocketOpen.push(onOpened);
            }
        };
    })();

    socket.onmessage = function (event) {
        var messageObject;
        try {
            messageObject = JSON.parse(event.data);
        } catch (ex) {
            return;
        }
        if (!messageObject.title || !callbacks[messageObject.title]) {
            return;
        }
        callbacks[messageObject.title](messageObject.body);
    };

    return {
        on: function (title, callback) {
            callbacks[title] = callback;
        },
        send: function (title, body) {
            ensureSocketOpened(function () {
                socket.send(JSON.stringify({
                    title: title,
                    body: body
                }));
            });
        },
        remove: function (title) {
            delete callbacks[title];
        },
        onClose: function (callback) {
            socket.onclose = function (event) {
                callback(event);
            };
        }
    };
};