const chalk = require('chalk');
const morgan = require('morgan');

module.exports = morgan((tokens, req, res) => ([
  '\n',
  chalk.hex('#f78fb3').bold(tokens.date(req, res)),
  chalk.hex('#34ace0').bold(tokens.method(req, res)),
  chalk.hex('#ffb142').bold(tokens.status(req, res)),
  chalk.hex('#ff5252').bold(tokens.url(req, res)),
]).join(' '), {
  skip: ({ url }) => url === '/health',
});
