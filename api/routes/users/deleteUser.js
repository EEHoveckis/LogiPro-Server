const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const deleteUser = require("../../helperFuncs/userActions/deleteUser.js");
const newLog = require("../../helperFuncs/logging/newLog.js");

const options = {
	name: "deleteUser",
	required: ["username", "temptoken", "queryUsername"],
	permissions: "ADMIN",
	specialRules: "noDeleteSelf"
};

router.delete("/", (req, res) => {
	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("500 - User Does Not Exist");
		if (req.query.username == req.headers.username) return res.status(500).send("500 - Cannot Delete Yourself!");
		newLog(req);
		return res.status(200).send(deleteUser(req));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
