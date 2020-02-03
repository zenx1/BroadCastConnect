window.addEventListener('DOMContentLoaded', function (event) {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - document.getElementById('qrCode').offsetTop;

    var qrSize = height;

    if (qrSize > width) {
        qrSize = width;
    }

    var wsUrl = 'ws://' + document.location.host;

    var messaging = clientMessaging(wsUrl);

    messaging.on('uuid', function (uuid) {
        QRCode.toCanvas(document.getElementById('qrCode'), JSON.stringify({
            wsUrl: wsUrl,
            uuid: uuid
        }), {
            width: qrSize,
            height: qrSize
        }, function (error) {

        });
    });

    messaging.on('redirect', function (url) {
        window.location.href = url;
    });

    messaging.send('getUuid');
});