const { existsSync } = require("fs");
const express = require('express');
const router = express.Router();

function authenticate(req) {

}

router.get("/", (req, res) => {
	// These shouldn't happen, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const loginData = require(`../data/users/${req.headers.username}.json`);
		if (loginData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To View Content");
		if (loginData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > loginData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		const userData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
		res.format({
			"application/json": () => {
				res.status(200).json(userData);
			}
		});

	} catch (err) {
		console.log(err)
		res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

module.exports = router;
