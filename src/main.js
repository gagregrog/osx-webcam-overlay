const open = require('open');

const u = require('./lib/util');
const c = require('./lib/constants');
const server = require('./lib/server');
const handlePort = require('./lib/handlePort');
const handleCamTwist = require('./lib/handleCamTwist');

const main = async () => {
  try {
    await handleCamTwist();
  } catch (error) {
    u.err(`There was an error starting ${c.effectName}.`);
    u.err(error);
    return;
  }

  const port = await handlePort(3000);

  if (!port) {
    return u.warn('Project could not be started.');
  }

  await server.start(port);
  const url = `http://localhost:${port}`;

  u.log(`Opening browser to ${url}`);
  open(url);
};

module.exports = main;
