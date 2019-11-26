const u = require('./lib/util');
const server = require('./lib/server');
const handlePort = require('./lib/handlePort');

const main = async () => {
  const port = await handlePort(3000);
  if (!port) {
    return u.warn('Project could not be started.');
  }

  return server.start(port);
};

module.exports = main;
