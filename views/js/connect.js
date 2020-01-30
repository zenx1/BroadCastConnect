window.addEventListener('DOMContentLoaded', function (event) {

    var wsUrl = 'ws://' + document.location.host;
    var socket = new WebSocket(wsUrl);

    socket.onopen = function (e) {
        socket.send(JSON.stringify({ fromWebPage: true }));
    };
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - document.getElementById('qrCode').offsetTop;

    var qrSize = height;

    if (qrSize > width) {
        qrSize = width;
    }

    socket.onmessage = function (event) {
        var messageObject = JSON.parse(event.data);
        if (messageObject.uuid) {
            QRCode.toCanvas(document.getElementById('qrCode'), JSON.stringify({
                wsUrl: wsUrl,
                uuid: messageObject.uuid
            }), {
                width: qrSize,
                height: qrSize
            }, function (error) {

            });
        } else if (messageObject.url) {
            window.location.href = messageObject.url;
        }
    };

    socket.onclose = function (event) {

    };

    socket.onerror = function (error) {
    };
});