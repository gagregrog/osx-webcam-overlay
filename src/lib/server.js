const express = require('express');

const u = require('./util');
const c = require('./constants');
const middleware = require('../middleware');

const start = async port => new Promise((resolve) => {
  const app = express();
  app.use(express.static(c.publicDir));
  app.use(middleware);

  app.listen(port, () => {
    u.log(`Listening on port ${port}`, { announce: 'server' });

    return resolve();
  });
});

module.exports = { start };
