const { existsSync, writeFileSync } = require("fs");
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const userData = require(`../data/users/${req.headers.username}.json`);
		if (userData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");

		userData.tempToken = "";
		userData.tokenValidTill = "";
		userData.lastLogin = `${Date.now()}`;
		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(userData));

		return res.status(200).send("Logged out! Goodbye!");
	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

module.exports = router;
