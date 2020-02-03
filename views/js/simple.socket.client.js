/* IMPORTANT
 *
 * Don't use features of ES6 and above as plenty of smart TVs
 * use outdated browsers which don't support ES6 and above
 */

var simpleSocketClient = function (wsUrl) {
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
        var data;
        try {
            data = JSON.parse(event.data);
        } catch (ex) {
            return;
        }
        if (!data.name || !callbacks[data.name]) {
            return;
        }
        callbacks[data.name](data.body);
    };

    return {
        on: function (name, callback) {
            callbacks[name] = callback;
        },
        send: function (name, body) {
            ensureSocketOpened(function () {
                socket.send(JSON.stringify({
                    name: name,
                    body: body
                }));
            });
        },
        remove: function (name) {
            delete callbacks[name];
        },
        onClose: function (callback) {
            socket.onclose = function (event) {
                callback(event);
            };
        }
    };
};