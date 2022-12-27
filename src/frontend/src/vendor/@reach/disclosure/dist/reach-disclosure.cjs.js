"use strict";

if (process.env.NODE_ENV === "production") {
	module.exports = require("./reach-disclosure.cjs.prod.js");
} else {
	module.exports = require("./reach-disclosure.cjs.dev.js");
}
