const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");
const renewToken = require("./renewToken.js");

module.exports = function(req) {
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return [401, "401 - Incorrect Username!"];
	const loginData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);

	if (loginData.status == "DELETED") return [403, "403 - This Account Is Marked For Deletion!"];

	if (req.baseUrl == "/api/login") {
		const receivedPass = scryptSync(req.headers.password, loginData.uniqueSalt, 64).toString("hex");
		if (req.headers.username == undefined || req.headers.password == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.password != receivedPass) return [403, "403 - Incorrect Password!"];
	} else if (req.baseUrl == "/api/logout") {
		if (req.headers.username == undefined || req.headers.temptoken == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.tempToken != req.headers.temptoken) return [403, "403 - Incorrect Temporary Token!"];
		renewToken(req);
	} else if (req.baseUrl == "/api/users") {
		if (req.headers.username == undefined || req.headers.temptoken == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.tempToken != req.headers.temptoken) return [403, "403 - Incorrect Temporary Token!"];
		if (loginData.group != "ADMIN") return [403, "Not Authorized To View Content"];
		renewToken(req);
	}
	return 200;
};
