const path = require('path');

const c = module.exports = {};

c.prod = process.env.NODE_ENV === 'production';
c.publicDir = path.resolve(`${__dirname}/../public`);
