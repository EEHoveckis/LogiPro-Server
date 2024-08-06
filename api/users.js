const { scryptSync } = require('crypto');
const fs = require("fs");
const express = require('express');
const router = express.Router();

function authenticate(req) {
	let authResponse, receivedKey;
	try {
		if (req.headers.username == undefined || req.headers.password == undefined) throw authResponse = "MISSING PARAMETERS";
		const loginData = require(`../data/users/${req.headers.username}.json`);
		const receivedKey = scryptSync(req.headers.password, loginData.uniqueSalt, 64).toString("hex");
		console.log("EXPECTED: " + loginData.password);
		console.log("RECEIVED: " + receivedKey);
		if (loginData.password != receivedKey) authResponse = "INCORRECT PASSWORD";
		if (loginData.group != "ADMIN") authResponse = "MISSING PERMISSIONS";
	} catch (err) {
		if (!authResponse) authResponse = "INCORRECT USERNAME";
	} finally {
		if (!authResponse) return "OK";
		else return authResponse;
	}
}

router.get("/", (req, res) => {
	const authResponse = authenticate(req);
	console.log(authResponse);
	switch (authResponse) {
		case "MISSING PARAMETERS":
			res.status(401).send("401 - Missing Authentification Parameters");
			break;
		case "INCORRECT PASSWORD":
			res.status(403).send("403 - Incorrect Password");
			break;
		case "MISSING PERMISSIONS":
			res.status(403).send("403 - Not Authorized To View Content");
			break;
		case "INCORRECT USERNAME":
			res.status(403).send("403 - Incorrect Username");
			break;
		case "OK":
			try {
				const userData = require(`../data/users/${req.query.username}.json`);
				res.format({
					"application/json": () => {
						res.status(200).json(userData);
					}
				});
			} catch (err) {
				res.status(404).send("404 - Requested User Does Not Exist");
			}
			break;
		default:
			res.status(500).send("500 - Internal Error");
	}
});

module.exports = router;
