const HTTP = require('http');
const APP = require('../backend/app');

const PORT = process.env.PORT || 4000;

APP.set('port', PORT);

const SERVER = HTTP.createServer(APP);

SERVER.listen(PORT);
