#!/usr/bin/env node

var connect = require("connect");

connect(
	connect.static(require("path").join(__dirname, "/../", "/builds/edge-cache/"))
).listen(3000);
