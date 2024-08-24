const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");
const renewToken = require("./renewToken.js");

module.exports = function(req) {
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return [401, "401 - Incorrect Username!"]; // User Does Not Exist
	const loginData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);

	if (loginData.status == "DELETED") return [403, "403 - This Account Is Marked For Deletion!"]; // User Account Marked For Deletion
	if (loginData.status == "BLOCKED") return [403, "403 - This Account Is Currently Blocked! Contact Administrator!"]; // User Inputted Wrong Password Too Many Times And Is Blocked

	if (req.baseUrl == "/api/login") {
		const receivedPass = scryptSync(req.headers.password, loginData.uniqueSalt, 64).toString("hex");
		if (req.headers.username == undefined || req.headers.password == undefined) return [401, "401 - Missing Authentification Parameters!"]; // Missing Parameters
		if (loginData.password != receivedPass) { // Wrong Password
			if (loginData.wrongPassword <= 2) {
				loginData.wrongPassword += 1;
				writeFileSync(`./data/users/${req.headers.username}.json`, JSON.stringify(loginData));
				return [403, `403 - Incorrect Password! ${3 - loginData.wrongPassword} Tries Left!`];
			} else if (loginData.wrongPassword == 3) {
				loginData.status = "BLOCKED";
				writeFileSync(`./data/users/${req.headers.username}.json`, JSON.stringify(loginData));
				return [403, "403 - Incorrect Password! Your Account Has Been Blocked! Contact Administrator!"];
			}
			return [403, "403 - Incorrect Password!"];
			writeFileSync(`./data/users/${userObject.username}.json`, JSON.stringify(userObject));
		}
	} else if (req.baseUrl == "/api/logout") {
		if (req.headers.username == undefined || req.headers.temptoken == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.tempToken != req.headers.temptoken) return [403, "403 - Incorrect Temporary Token!"];
		if (Date.now() > loginData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");
		renewToken(req);
	} else if (req.baseUrl == "/api/users") {
		if (req.headers.username == undefined || req.headers.temptoken == undefined) return [401, "401 - Missing Authentification Parameters!"];
		if (loginData.tempToken != req.headers.temptoken) return [403, "403 - Incorrect Temporary Token!"];
		if (Date.now() > loginData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");
		if (loginData.group != "ADMIN") return [403, "Not Authorized To View Content"];
		renewToken(req);
	}
	return 200;
};
