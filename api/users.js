const { scryptSync, randomBytes } = require('crypto');
const { existsSync, writeFileSync, rename } = require("fs");
const express = require('express');
const router = express.Router();
const auth = require("./auth.js");

router.get("/", (req, res) => {
	//if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired"); // later...

	try {
		const authReturn = auth(req);
		if (authReturn == 200) {
			const returnData = require(`${process.cwd()}/data/users/${req.query.username}.json`);
			res.status(200).json(returnData);
		} else {
			res.status(authReturn[0]).send(authReturn[1]);
		}
	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

router.put("/", (req, res) => {
	//if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired"); // later...

	try {
		const authReturn = auth(req);
		if (authReturn == 200) {
			if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
			if (req.query.newusername == undefined && req.query.newfirstname == undefined && req.query.newlastname == undefined && req.query.newpassword == undefined && req.query.newgroup == undefined) res.send("500 - No Parameters To Change Supplied");
			let oldUserObject = require(`${process.cwd()}/data/users/${req.query.username}.json`);
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
			if (oldUserObject.username != req.query.newusername && req.query.newusername != undefined) {
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

			res.status(200).json(newUserObject);
		} else {
			res.status(authReturn[0]).send(authReturn[1]);
		}

	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

router.post("/", (req, res) => {
	//if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired"); // later...

	try {
		const authReturn = auth(req);
		if (authReturn == 200) {
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
			res.status(200).json(userObject);
		} else {
			res.status(authReturn[0]).send(authReturn[1]);
		}
	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

router.delete("/", (req, res) => {
	//if (Date.now() > userData.tokenValidTill) return res.status(403).send("403 - Temporary Token Expired"); // later...

	try {
		const authReturn = auth(req);
		if (authReturn == 200) {
			if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
			if (req.query.username == req.headers.username) return res.status(500).send("500 - Cannot Delete Yourself!");

			const userObject = require(`${process.cwd()}/data/users/${req.query.username}.json`);
			userObject.status = "DELETED";
			writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(userObject));
			return res.status(200).send("200 - User Deleted");
		} else {
			res.status(authReturn[0]).send(authReturn[1]);
		}
	} catch (err) {
		return res.status(500).send("500 - Something went wrong, sorry for that. :(");
	}
});

module.exports = router;
