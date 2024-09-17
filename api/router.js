const express = require("express");

module.exports = function(app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// Login / Logout
	app.use("/api/login", require("./routes/auth/login.js"));
	app.use("/api/logout", require("./routes/auth/logout.js"));
};
