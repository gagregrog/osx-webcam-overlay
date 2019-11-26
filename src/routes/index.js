const { Router } = require('express');

const api = require('./api');
const health = require('./health');
const catchAll = require('./catch-all');
const serveHtml = require('./serveHtml');

module.exports = new Router()
  .use([
    api,
    health,
    serveHtml,
    catchAll,
  ]);
