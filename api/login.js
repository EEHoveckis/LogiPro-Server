const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	if (req.headers.username == undefined || req.headers.password == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	const loginData = require(`../data/users/${req.headers.username}.json`);
	const receivedKey = scryptSync(req.headers.password, loginData.uniqueSalt, 64).toString("hex");
	if (loginData.password != receivedKey) return res.status(403).send("401 - Incorrect Password");

	loginData.tempToken = randomBytes(8).toString("hex");
	loginData.tokenValidTill = `${Date.now() + 1 * 60 * 60 * 1000}`;
	loginData.lastLogin = `${Date.now()}`;
	writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(loginData));

	res.format({
		"application/json": () => {
			res.status(200).json(loginData);
		}
	});
});

module.exports = router;
