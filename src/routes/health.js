const { Router } = require('express');

module.exports = new Router()
  .get('/health', (req, res) => res.sendStatus(200));
