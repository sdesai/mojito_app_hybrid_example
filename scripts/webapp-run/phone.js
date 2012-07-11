#!/usr/bin/env node

var connect = require('connect'),
    path = require('path');

connect()
    .use(connect.static(path.join(__dirname, '../../', 'builds', 'webapp', 'phone')))
    .listen(3000);

console.log('http://localhost:3000/index.html');