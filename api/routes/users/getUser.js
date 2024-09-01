const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const newLog = require("../../helperFuncs/logging/newLog.js");

const options = {
	name: "getUser",
	required: ["username", "temptoken", "queryUsername"],
	permissions: "ADMIN"
};

router.get("/", (req, res) => {
	const options = {
		name: "getUser",
		username: req.headers.username,
		userLog: `Requested Info For ${req.query.username}`,
		serverLog: `${req.headers.username} Requested Info For ${req.query.username}`,
		required: ["username", "temptoken", "queryUsername"],
		permissions: "ADMIN"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("User Does Not Exist!");
		newLog(options);
		res.status(200).json(require(`${process.cwd()}/data/users/${req.query.username}.json`));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
