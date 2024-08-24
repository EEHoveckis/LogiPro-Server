const { existsSync, writeFileSync } = require("fs");
const router = require('express').Router();
const auth = require("./helperFuncs/authentification/auth.js");

router.get("/", (req, res) => {
	const authReturn = auth(req);
	if (authReturn == 200) {
		try {
			const authData = require(`../data/users/${req.headers.username}.json`);
			authData.online = false;
			authData.tempToken = "";
			authData.tokenValidTill = "";
			authData.lastLogin = "";
			writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));
			return res.status(200).send(authData);
		} catch (err) {
			return res.status(500).send("500 - Something went wrong, sorry for that. :(");
		}
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
