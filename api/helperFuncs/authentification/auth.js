const { scryptSync } = require('crypto');
const { existsSync, writeFileSync } = require("fs");
const renewToken = require("./renewToken.js");

module.exports = function(req, options) {
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return [401, "401 - Incorrect Username!"];
	const loginData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);

	if (loginData.status == "DELETED") return [403, "403 - This Account Is Marked For Deletion!"];
	if (loginData.status == "BLOCKED") return [403, "403 - This Account Is Currently Blocked! Contact Administrator!"];

	if (options.required.includes("password") && req.headers.password == undefined) return [403, "403 - Missing Password!"];
	if (options.required.includes("password") && scryptSync(req.headers.password, loginData.uniqueSalt, 64).toString("hex") != loginData.password) {
		if (loginData.wrongPassword <= 2) {
			loginData.wrongPassword += 1;
			writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(loginData));
			return [403, `403 - Incorrect Password! ${3 - loginData.wrongPassword} Tries Left!`];
		} else if (loginData.wrongPassword == 3) {
			loginData.status = "BLOCKED";
			writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(loginData));
			return [403, "403 - Incorrect Password! Your Account Has Been Blocked! Contact Administrator!"];
		}
	}

	if (options.required.includes("temptoken") && req.headers.temptoken == undefined) return [403, "403 - Missing Temporary Token!"];
	if (options.required.includes("temptoken") && req.headers.temptoken != loginData.temptoken) return [403, "403 - Incorrect Temporary Token!"];
	if (options.required.includes("temptoken") && loginData.tokenValidTill < Date.now()) return [403, "Temporary Token Expired!"];

	if (options.permissions && options.permissions != loginData.group) return [403, "Not Authorized To View Content"];
	renewToken(req);
	return 200;
};

// FUTURE! This needs to be able to look up neccesary parameters, permissions and other stuff.
