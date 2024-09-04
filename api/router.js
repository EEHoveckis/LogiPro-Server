const express = require("express");

module.exports = function(app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// Login / Logout
	app.use("/api/login", require("./routes/auth/login.js"));
	app.use("/api/logout", require("./routes/auth/logout.js"));

	// User Management
	app.use("/api/getuser", require("./routes/users/getUser.js"));
	app.use("/api/newuser", require("./routes/users/newUser.js"));
	app.use("/api/edituser", require("./routes/users/editUser.js"));
	app.use("/api/deleteuser", require("./routes/users/deleteUser.js"));

	// Orders
	app.use("/api/orders", require("./routes/orders/orders.js"));

	// Warehouses
	app.use("/api/newwarehouse", require("./routes/warehouses/newWarehouse.js"));
	app.use("/api/deletewarehouse", require("./routes/warehouses/deleteWarehouse.js"));

	// Logs
	app.use("/api/getuserlogs", require("./routes/logging/getUserLogs.js"));
	app.use("/api/getserverlogs", require("./routes/logging/getserverlogs.js"));
}
