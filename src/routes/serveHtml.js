const { Router } = require('express');
const c = require('../lib/constants');

module.exports = new Router()
  .get('*', (req, res) => res.sendFile(`${c.publicDir}/index.html`));
