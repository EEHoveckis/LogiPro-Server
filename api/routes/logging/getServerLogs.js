const router = require('express').Router();
const { existsSync } = require("fs");
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");

router.get("/", (req, res) => {
	const options = {
		username: req.headers.username,
		userLog: `Requested Server Logs`,
		serverLog: `${req.headers.username} Requested Server Logs`,
		required: ["username", "temptoken"],
		optional: ["start", "end"],
		permissions: "getServerLogs"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/logs/serverLogs.json`)) return res.status(404).send("404 - Logs Do Not Exist");
		const serverLogs = require(`${process.cwd()}/data/logs/serverLogs.json`);
		userLog(options);
		serverLog(options);
		if (req.query.start && req.query.end) {
			let specificLogs = {};
			for (const timestamp in serverLogs) {
				if (timestamp >= req.query.start && timestamp <= req.query.end) Object.assign(specificLogs, {
								[timestamp]: serverLogs[timestamp]
				});
			}
			return res.status(200).json(specificLogs);
		} else if (req.query.start && req.query.end == undefined) {
			let specificLogs = {};
			for (const timestamp in serverLogs) {
				if (timestamp >= req.query.start) Object.assign(specificLogs, {
								[timestamp]: serverLogs[timestamp]
				});
			}
			return res.status(200).json(specificLogs);
		} else return res.status(200).json(serverLogs);
	} else {
		res.status(authReturn[0].send(authReturn[1]));
	}
});

module.exports = router;
