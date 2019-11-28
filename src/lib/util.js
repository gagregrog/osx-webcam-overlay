const chalk = require('chalk');

const u = module.exports = {};

u.getDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hrs = date.getHours();

  return `${month}/${day}/${year} ${hrs}:${min}:${sec}`;
};

u.announce = (announcement, details) => (
  `__${announcement
    .toUpperCase()
    .split(' ')
    .join('_')}__ ${details}`
);

const makePrefix = prefix => `[${prefix.toUpperCase()}]`;
const log = (prefix, hex) => (text, { stringify, announce, data } = {}) => {
  const prefixed = makePrefix(prefix);
  console.log(`\n${chalk.hex('#ffff55').bold(u.getDate())}`);

  const logs = [prefixed, (announce ? u.announce(announce, text) : text)];
  if (data) logs.push((stringify ? JSON.stringify(data, null, 2) : data));

  console.log(`${chalk.hex(hex).bold(...logs)}`);
};

u.log = log('info', '#31fce0');
u.warn = log('warn', '#f59f55');
u.err = log('error', '#ff0000');
u.stack = err => log('stack', '#f03fff')(err.stack);
u.error = (error) => {
  u.err(error.message);
  u.stack(error);
};
u.logReq = (url, options) => {
  const method = options.method || 'GET';

  const msg = `${method} request to ${url}.`;
  const headers = options.headers || {};
  const cleanedOptions = { ...options, headers: { ...headers } };
  if (cleanedOptions.headers.Authorization) {
    cleanedOptions.headers.Authorization = `${cleanedOptions.headers.Authorization.split(' ')[0]} [MASKED]`;
  }

  log('request', '#12aaf3')(msg, { data: cleanedOptions, stringify: true });
};

u.logRes = (url, options, res, data) => {
  const method = options.method || 'GET';

  const msg = `${method} request to ${url} succeeded with status code ${res.status}`;

  log('response', '#f2a0fa')(msg, { data, stringify: true });
};

u.prom = f => (...args) => new Promise((resolve, reject) => {
  f(...args, (error, data) => (error ? reject(error) : resolve(data)));
});
