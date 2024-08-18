const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync, rename } = require("fs");
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	// These shouldn't happen in client app, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const userData = require(`../data/users/${req.headers.username}.json`);
		if (userData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To View Content");
		if (userData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		const returnData = require(`${process.cwd()}/data/users/${req.query.username}.json`);
		res.format({
			"application/json": () => {
				res.status(200).json(returnData);
			}
		});

	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

router.put("/", (req, res) => {
	// These shouldn't happen in client app, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const userData = require(`../data/users/${req.headers.username}.json`);
		if (userData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To Post Content");
		if (userData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
		if (req.query.newusername == undefined && req.query.newfirstname == undefined && req.query.newlastname == undefined && req.query.newpassword == undefined && req.query.newgroup == undefined) res.send("500 - No Parameters To Change Supplied");

		let oldUserObject = require(`../data/users/${req.query.username}.json`);
		let newUserObject = {
			username: (req.query.newusername === undefined) ? oldUserObject.username : req.query.newusername,
			firstName: (req.query.newfirstname === undefined) ? oldUserObject.firstName : req.query.newfirstname,
			lastName: (req.query.newlastname === undefined) ? oldUserObject.lastName : req.query.newlastname,
			password: (req.query.newpassword === undefined) ? oldUserObject.password : scryptSync(req.query.newpassword, oldUserObject.uniqueSalt, 64).toString("hex"),
			uniqueSalt: oldUserObject.uniqueSalt,
			group: (req.query.newgroup === undefined) ? oldUserObject.group : req.query.newgroup,
			tempToken: oldUserObject.tempToken,
			tokenValidTill: oldUserObject.tokenValidTill,
			lastLogin: oldUserObject.lastLogin
		}

		if (oldUserObject.username != req.query.newusername) {
			rename(`${process.cwd()}/data/users/${req.query.username}.json`, `${process.cwd()}/data/users/${req.query.newusername}.json`, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).send("ERROR RENAMING USER");
				}
			});
			writeFileSync(`${process.cwd()}/data/users/${req.query.newusername}.json`, JSON.stringify(newUserObject));
		} else {
			writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(newUserObject));
		}

		res.format({
			"application/json": () => {
				return res.status(200).json(newUserObject);
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

router.post("/", (req, res) => {
	// These shouldn't happen in client app, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const userData = require(`../data/users/${req.headers.username}.json`);
		if (userData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To Post Content");
		if (userData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		if (existsSync(`${process.cwd()}/data/users/${req.query.newusername}.json`)) return res.status(500).send("500 - User Already Exists");
		if (req.query.newusername == undefined || req.query.newfirstname == undefined || req.query.newlastname == undefined || req.query.newpassword == undefined || req.query.newgroup == undefined) return res.send("500 - Some Parameters Not Supplied");

		uniqueSalt = randomBytes(16).toString("hex");
		let userObject = {
			username: req.query.newusername,
			firstName: req.query.newfirstname,
			lastName: req.query.newlastname,
			password: scryptSync(req.query.newpassword, uniqueSalt, 64).toString("hex"),
			uniqueSalt: uniqueSalt,
			online: false,
			group: req.query.newgroup,
			tempToken: "",
			tokenValidTill: "",
			lastLogin: "",
			loginHistory: [],
			status: "OK"
		}

		writeFileSync(`${process.cwd()}/data/users/${req.query.newusername}.json`, JSON.stringify(userObject));
		res.format({
			"application/json": () => {
				res.status(200).json(userObject);
			}
		});
	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

router.delete("/", (req, res) => {
	// These shouldn't happen in client app, but they are here just in case.
	if (req.headers.username == undefined || req.headers.temptoken == undefined) return res.status(401).send("401 - Missing Authentification Parameters");
	if (!existsSync(`${process.cwd()}/data/users/${req.headers.username}.json`)) return res.status(401).send("401 - Incorrect Username");

	try {
		const userData = require(`../data/users/${req.headers.username}.json`);
		if (userData.group != "ADMIN") return res.status(403).send("403 - Not Authorized To Post Content");
		if (userData.tempToken != req.headers.temptoken) return res.status(403).send("403 - Unknown Temporary Token");
		if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired");

		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
		if (req.query.username == req.headers.username) return res.status(500).send("500 - Cannot Delete Yourself!");

		const userObject = require(`${process.cwd()}/data/users/${req.query.username}.json`);
		userObject.status = "DELETED";

		writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(userObject));
		return res.status(200).send("200 - User Deleted");
	} catch (err) {
		console.log(err);
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

module.exports = router;
