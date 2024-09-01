const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const newLog = require("../../helperFuncs/logging/newLog.js");

const { existsSync, writeFileSync } = require("fs");

router.get("/", (req, res) => {
	const options = {
		name: "logout",
		username: req.headers.username,
		userLog: "Logged In!",
		serverLog: `${req.headers.username} Logged In!`,
		required: ["username", "temptoken"]
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
		authData.online = false;
		authData.temptoken = "";
		authData.tokenValidTill = "";
		authData.lastLogin = "";

		newLog(req);
		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));

		return res.status(200).send(authData);
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
