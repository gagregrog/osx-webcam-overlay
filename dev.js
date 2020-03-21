require('dotenv').config();
const getPort = require('./src/lib/handlePort');
const server = require('./src/lib/server');

if (!module.parent) {
  getPort(3000)
    .then(server.start)
    .catch(console.log);
}
