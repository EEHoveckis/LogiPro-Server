const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../helperFuncs/authentification/auth.js");
const newUser = require("../helperFuncs/userActions/newUser.js");
const editUser = require("../helperFuncs/userActions/editUser.js");
const deleteUser = require("../helperFuncs/userActions/deleteUser.js");

router.get("/", (req, res) => {
	if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("User Does Not Exist!");
	const authReturn = auth(req);
	if (authReturn == 200) {
		const returnData = require(`${process.cwd()}/data/users/${req.query.username}.json`);
		res.status(200).json(returnData);
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

router.put("/", (req, res) => {
	const authReturn = auth(req);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
		if (req.query.newusername == undefined && req.query.newfirstname == undefined && req.query.newlastname == undefined && req.query.newpassword == undefined && req.query.newgroup == undefined) res.send("500 - No Parameters To Change Supplied");
		res.status(200).json(editUser(req));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

router.post("/", (req, res) => {
	const authReturn = auth(req);
	if (authReturn == 200) {
		if (existsSync(`${process.cwd()}/data/users/${req.query.newusername}.json`)) return res.status(500).send("500 - User Already Exists");
		if (req.query.newusername == undefined || req.query.newfirstname == undefined || req.query.newlastname == undefined || req.query.newpassword == undefined || req.query.newgroup == undefined) return res.send("500 - Some Parameters Not Supplied");
		res.status(200).json(newUser(req));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

router.delete("/", (req, res) => {
	const authReturn = auth(req);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
		if (req.query.username == req.headers.username) return res.status(500).send("500 - Cannot Delete Yourself!");
		return res.status(200).send(deleteUser(req));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
