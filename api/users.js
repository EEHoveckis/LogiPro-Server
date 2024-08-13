const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync } = require("fs");
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	// These shouldn't happen, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const loginData = require(`../data/users/${req.headers.username}.json`);
		if (loginData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To View Content");
		if (loginData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > loginData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		const userData = require(`${process.cwd()}/data/users/${req.query.username}.json`);
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

router.post("/", (req, res) => {
	// These shouldn't happen, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const loginData = require(`../data/users/${req.headers.username}.json`);
		if (loginData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To Post Content");
		if (loginData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > loginData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		if (existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Already Exists");

		uniqueSalt = randomBytes(16).toString("hex");
		let userObject = {
			username: req.query.username,
			firstName: req.query.firstName,
			lastName: req.query.lastName,
			password: scryptSync(req.query.password, uniqueSalt, 64).toString("hex"),
			uniqueSalt: uniqueSalt,
			group: req.query.group,
			tempToken: "",
			tokenValidTill: "",
			lastLogin: ""
		}

		writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(userObject));
		res.format({
			"application/json": () => {
				res.status(200).json(userObject);
			}
		});
	} catch (err) {
		console.log(err)
		res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

module.exports = router;
