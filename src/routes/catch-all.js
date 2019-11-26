const { Router } = require('express');

module.exports = new Router()
  .all('*', (req, res) => res.sendStatus(404));
