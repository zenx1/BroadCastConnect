const express = require('express');
const app = express();
const server = require('http').Server(app);
const uuidv4 = require('uuid/v4');
const messaging = require('./helpers/server.messaging.js')(server);

app.use(express.static('views'));

messaging.on('getUuid', (webPage) => {
    const uuid = uuidv4();

    messaging.on(uuid, (mobileApp, url) => {
        messaging.send(webPage, 'redirect', url);
        messaging.remove(uuid);
    });

    webPage.on('close', () => {
        messaging.remove(uuid);
    });

    messaging.send(webPage, 'uuid', uuid);
});

app.set('port', process.env.PORT || 1337);
server.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port);
});
