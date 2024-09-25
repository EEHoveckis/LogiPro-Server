const express = require("express");

module.exports = function(app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// Login / Logout
	app.use("/api/login", require("./routes/auth/login.js"));
	app.use("/api/logout", require("./routes/auth/logout.js"));

	// Refresh Tokens
	app.use("/api/refresh", require("./routes/auth/refresh.js"));

	// Testing Route TODO: Remove this when finally not needed.
	app.use("/api/testing", require("./routes/auth/testing.js"));
};
