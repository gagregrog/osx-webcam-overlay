const u = require('../lib/util');

// eslint-disable-next-line
module.exports = (error, req, res, next) => {
  if (error.status && error.message) {
    res.statusMessage = error.message;

    u.err(`Returning status code ${error.status} and message: "${error.message}".`);

    return res.sendStatus(error.status);
  }

  u.err(error.message, { announce: 'unhandled error' })('error');
  u.stack(error);

  return res.sendStatus(500);
};
