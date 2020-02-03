const express = require('express');
const app = express();
const server = require('http').Server(app);
const uuidv4 = require('uuid/v4');
const simpleSocket = require('./helpers/simple.socket.server.js')(server);

app.use(express.static('views'));

simpleSocket.on('getUuid', (webPage) => {
    const uuid = uuidv4();

    simpleSocket.on(uuid, (mobileApp, url) => {
        simpleSocket.send(webPage, 'redirect', url);
    });

    webPage.on('close', () => {
        simpleSocket.remove(uuid);
    });

    simpleSocket.send(webPage, 'uuid', uuid);
});

app.set('port', process.env.PORT || 1337);
server.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port);
});
