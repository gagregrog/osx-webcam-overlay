const prompts = require('prompts');
const fp = require('find-free-port');

const u = require('./util');

const validatePort = port => (
  (!port.replace(/\d{4}/, '').length) && (port[0] !== '0')
    ? true
    : 'Please enter a value between 1000 and 9999.'
);

const handlePortUnavailable = async (desiredPort, availablePort) => {
  u.warn(`Port ${desiredPort} is unavailable.`);

  const { declinePort, secondChoice } = await prompts([
    {
      type: 'toggle',
      name: 'declinePort',
      message: `Would you like to start on port ${availablePort} instead?`,
      inactive: 'Yes',
      active: 'No',
    },
    {
      type: port => ((port !== false) ? 'text' : false),
      name: 'secondChoice',
      message: 'What port would you like?',
      validate: validatePort,
      format: Number,
    },
  ]);

  if (secondChoice) {
    // eslint-disable-next-line
    return handleGetPort(secondChoice);
  }

  const acceptPort = (declinePort === false);

  return acceptPort && availablePort;
};

async function handleGetPort(desiredPort) {
  const [port] = await fp(desiredPort);

  if (port !== desiredPort) {
    return handlePortUnavailable(desiredPort, port);
  }

  return port;
}

module.exports = handleGetPort;
