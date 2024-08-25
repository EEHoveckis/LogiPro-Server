const express = require("express");
const loginPath = require("./api/routes/login");
const logoutPath = require("./api/routes/logout");
const userManagement = require("./api/routes/users");

module.exports = function(app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use("/api/login", loginPath);
	app.use("/api/logout", logoutPath);
	app.use("/api/users", userManagement);
}
