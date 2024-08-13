const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	if (req.headers.username == undefined || req.headers.password == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	const userData = require(`../data/users/${req.headers.username}.json`);
	const receivedKey = scryptSync(req.headers.password, userData.uniqueSalt, 64).toString("hex");
	if (userData.password != receivedKey) return res.status(403).send("401 - Incorrect Password");

	userData.tempToken = randomBytes(8).toString("hex");
	userData.tokenValidTill = `${Date.now() + 1 * 60 * 60 * 1000}`;
	userData.lastLogin = `${Date.now()}`;
	writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(userData));

	res.format({
		"application/json": () => {
			res.status(200).json(userData);
		}
	});
});

module.exports = router;
