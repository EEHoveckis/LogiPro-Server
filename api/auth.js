const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");

module.exports = function(req) {
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return [401, "401 - Incorrect Username!"];
	const loginData = require(`../data/users/${req.headers.username}.json`);

	if (loginData.status == "DELETED") return [403, "403 - This Account Is Marked For Deletion!"];

	if (req.path == "/api/login") {
		const receivedPass = scryptSync(req.headers.password, loginData.uniqueSalt, 64).toString("hex");
		if (req.headers.username == undefined || req.headers.password == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.password != receivedPass) return [403, "403 - Incorrect Password!"];
	} else if (req.path == "/api/logout") {
		if (req.headers.username == undefined || req.headers.temptoken == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.tempToken != req.headers.temptoken) return [403, "403 - Incorrect Temporary Token!"];
	} else if (req.path == "/api/users") {
		if (req.headers.username == undefined || req.headers.temptoken == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.tempToken != req.headers.temptoken) return [403, "403 - Incorrect Temporary Token!"];
	}

	return 200;
};
