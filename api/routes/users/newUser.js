const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const newUser = require("../../helperFuncs/userActions/newUser.js");
const newLog = require("../../helperFuncs/logging/newLog.js");

const options = {
	name: "newUser",
	required: ["username", "temptoken", "queryUsername"],
	permissions: "ADMIN"
};

router.post("/", (req, res) => {
	const options = {
		name: "newUser",
		username: req.headers.username,
		userLog: `Created New User - ${req.query.newusername}`,
		serverLog: `${req.headers.username} Created User ${req.query.username} For Deletion`,
		required: ["username", "temptoken", "queryUsername"],
		permissions: "ADMIN"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (existsSync(`${process.cwd()}/data/users/${req.query.newusername}.json`)) return res.status(500).send("500 - User Already Exists");
		if (req.query.newusername == undefined || req.query.newfirstname == undefined || req.query.newlastname == undefined || req.query.newpassword == undefined || req.query.newgroup == undefined) return res.send("500 - Some Parameters Not Supplied");
		newLog(options);
		res.status(200).json(newUser(req));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
