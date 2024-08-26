const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");

const { randomBytes } = require('crypto');
const { writeFileSync } = require("fs");

router.get("/", (req, res) => {
	const authReturn = auth(req);
	if (authReturn == 200) {
		const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
		authData.online = true;
		authData.tempToken = randomBytes(8).toString("hex");
		authData.tokenValidTill = `${Date.now() + 1 * 60 * 60 * 1000}`;
		authData.lastLogin = `${Date.now()}`;
		authData.loginHistory.push(Date.now());

		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));
		res.status(200).json(authData);
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
