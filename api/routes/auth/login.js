const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");

const { randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");

router.get("/", (req, res) => {
	const options = {
		name: "login",
		username: req.headers.username,
		userLog: "Logged In!",
		serverLog: `${req.headers.username} Logged In!`,
		required: ["username", "password"]
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
		authData.online = true;
		authData.temptoken = randomBytes(8).toString("hex");
		authData.tokenValidTill = `${Date.now() + 1 * 60 * 60 * 1000}`;
		authData.lastLogin = `${Date.now()}`;
		authData.loginHistory.push(Date.now());

		userLog(options);
		serverLog(options);
		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));

		return res.status(200).json(authData);
	} else {
		return res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
