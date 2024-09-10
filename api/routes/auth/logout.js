const router = require('express').Router();
const verifyToken = require("../../helperFuncs/auth/verifyToken.js");

//const { existsSync, writeFileSync } = require("fs");

router.post("/", verifyToken, (req, res) => {
	//const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);

	//writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));

	//return res.status(200).send(authData);
	//return res.status(authReturn[0]).send(authReturn[1]);
	res.status(200).send("Logged Out!");
});

module.exports = router;
