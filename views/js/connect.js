/* IMPORTANT
 *
 * Don't use features of ES6 and above as plenty of smart TVs
 * use outdated browsers which don't support ES6 and above
 */

window.addEventListener('DOMContentLoaded', function (event) {
    var wsUrl = 'ws://' + document.location.host;

    var messaging = clientMessaging(wsUrl);

    var getQrSize = function () {
        var viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var viewPortHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - document.getElementById('qrCode').offsetTop;
        return viewPortWidth < viewPortHeight ? viewPortWidth : viewPortHeight;
    };

    messaging.on('uuid', function (uuid) {
        var qrSize = getQrSize();

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