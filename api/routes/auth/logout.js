const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");

const { existsSync, writeFileSync } = require("fs");

router.get("/", (req, res) => {
	const options = {
		userLog: "Logged In!",
		serverLog: `${req.headers.username} Logged Out!`,
		required: ["username", "temptoken"]
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
		authData.online = false;
		authData.temptoken = "";
		authData.tokenValidTill = "";
		authData.lastLogin = "";

		userLog(options);
		serverLog(options);
		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));

		return res.status(200).send(authData);
	} else {
		return res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
