/* IMPORTANT
 *
 * Don't use features of ES6 and above as plenty of smart TVs
 * use outdated browsers which don't support ES6 and above
 */

window.addEventListener('DOMContentLoaded', function (event) {
    var getQrSize = function () {
        var viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var viewPortHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - document.getElementById('qrCode').offsetTop;
        return viewPortWidth < viewPortHeight ? viewPortWidth : viewPortHeight;
    };

    var wsUrl = 'ws://' + document.location.host;

    var simpleSocket = new simpleSocketClient(wsUrl);

    simpleSocket.on('uuid', function (uuid) {
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

    var isRedirecting = false;

    simpleSocket.on('redirect', function (url) {
        isRedirecting = true;
        window.location.href = url;
    });

    simpleSocket.send('getUuid');

    simpleSocket.onClose(function () {
        if (isRedirecting) {
            return;
        }
        document.getElementById('qrCode').style.display = 'none';
        document.getElementById('instruction').textContent = 'Oops, something went wrong - please reload page and try again.';
    });
});