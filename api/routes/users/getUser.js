const { existsSync } = require("fs");
const router = require('express').Router();
const auth = require("../../helperFuncs/authentification/auth.js");
const newLog = require("../../helperFuncs/logging/newLog.js");

router.get("/", (req, res) => {
	if (!existsSync(`${process.cwd()}/data/users/${req.query.username}.json`)) return res.status(500).send("User Does Not Exist!");
	const authReturn = auth(req);
	if (authReturn == 200) {
		newLog(req);
		res.status(200).json(require(`${process.cwd()}/data/users/${req.query.username}.json`));
	} else {
		res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
