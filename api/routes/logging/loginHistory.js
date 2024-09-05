const router = require('express').Router();
const { existsSync } = require("fs");
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");


router.get("/", (req, res) => {
	const options = {
		username: req.headers.username,
		userLog: `Requested Login History For User ${req.query.username}`,
		serverLog: `${req.headers.username} Requested Login History For User ${req.query.username}`,
		required: ["username", "temptoken", "queryUsername"],
		optional: ["start", "end"],
		permissions: "getUserLogs"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(404).send("404 - User Does Not Exist");
		const loginHistory = require(`${process.cwd()}/data/users/${req.query.username}.json`).loginHistory;
		userLog(options);
		serverLog(options);
		if (req.query.start && req.query.end) {
			let specificLogs = [];
			for (var i = 0; i < loginHistory.length; i++) {
				if (loginHistory[i] >= req.query.start && loginHistory[i] <= req.query.end) specificLogs.push(loginHistory[i]);
			}
			return res.status(200).json(specificLogs);
		} else if (req.query.start && req.query.end == undefined) {
			let specificLogs = [];
			for (var i = 0; i < loginHistory.length; i++) {
				if (loginHistory[i] >= req.query.start) specificLogs.push(loginHistory[i]);
			}
			return res.status(200).json(specificLogs);
		} else return res.status(200).json(loginHistory);
	} else {
		res.status(authReturn[0].send(authReturn[1]));
	}
});

module.exports = router;
