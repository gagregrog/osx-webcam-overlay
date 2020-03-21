#!/usr/bin/env node

require('dotenv').config();

const main = require('./src/main');

if (!module.parent) main();
