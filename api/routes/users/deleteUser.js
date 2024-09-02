const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const deleteUser = require("../../helperFuncs/userActions/deleteUser.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");

router.delete("/", (req, res) => {
	const options = {
		name: "deleteUser",
		username: req.headers.username,
		userLog: `Marked User For Deletion - ${req.query.username}`,
		serverLog: `${req.headers.username} Marked User ${req.query.username} For Deletion`,
		required: ["username", "temptoken", "queryUsername"],
		permissions: "ADMIN",
		specialRules: "noDeleteSelf"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
		if (req.query.username == req.headers.username) return res.status(500).send("500 - Cannot Delete Yourself!");
		userLog(options);
		serverLog(options);
		return res.status(200).send(deleteUser(req));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
