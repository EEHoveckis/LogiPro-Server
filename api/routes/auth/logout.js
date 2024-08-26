const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");

const { existsSync, writeFileSync } = require("fs");

router.get("/", (req, res) => {
	const authReturn = auth(req);
	if (authReturn == 200) {
		const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
		authData.online = false;
		authData.tempToken = "";
		authData.tokenValidTill = "";
		authData.lastLogin = "";
		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));

		if (existsSync(`${process.cwd()}/data/logs/${req.headers.username}.json`)) {
			const userLogs = require(`${process.cwd()}/data/logs/${req.headers.username}.json`);
			Object.assign(userLogs, {
					[Date.now()]: "Logged Out!"
			});

			writeFileSync(`${process.cwd()}/data/logs/${req.headers.username}.json`, JSON.stringify(userLogs));
		} else {
			const userLogs = {
					[Date.now()]: "Logged Out!"
			};
			writeFileSync(`${process.cwd()}/data/logs/${req.headers.username}.json`, JSON.stringify(userLogs));
		}

		return res.status(200).send(authData);

	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
