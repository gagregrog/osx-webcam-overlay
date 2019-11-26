const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

const errorMiddleware = require('./error');
const routesMiddleware = require('../routes');
const activityMiddleware = require('./activity');

module.exports = new express.Router()
  .use([
    helmet({
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'no-referrer' },
    }),
    cors({ origin: '*' }),
    activityMiddleware,
    express.json(),
    routesMiddleware,
    errorMiddleware,
  ]);
