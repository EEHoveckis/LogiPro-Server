const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");

router.get("/", (req, res) => {
	const options = {
		username: req.headers.username,
		userLog: `Requested Info For ${req.query.username}`,
		serverLog: `${req.headers.username} Requested Info For ${req.query.username}`,
		required: ["username", "temptoken", "queryUsername"],
		permissions: "getUser"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(404).send("404 - User Does Not Exist!");
		userLog(options);
		serverLog(options);
		res.status(200).json(require(`${process.cwd()}/data/users/${req.query.username}.json`));
	} else {
		return res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
