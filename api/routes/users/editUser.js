const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const editUser = require("../../helperFuncs/userActions/editUser.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");

router.put("/", (req, res) => {
	const options = {
		username: req.headers.username,
		userLog: `Edited User - ${req.query.username}`,
		serverLog: `${req.headers.username} Edited Info For User ${req.query.username}`,
		required: ["username", "temptoken", "queryUsername"],
		permissions: "editUsers"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(404).send("404 - User Does Not Exist");
		if (req.query.newusername == undefined && req.query.newfirstname == undefined && req.query.newlastname == undefined && req.query.newpassword == undefined && req.query.newpermissions == undefined) res.send("500 - No Parameters To Change Supplied");
		userLog(options);
		serverLog(options);
		res.status(200).json(editUser(req));
	} else {
		return res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
