const router = require("express").Router();
const { existsSync } = require("fs");
const verifyPassword = require("../../helperFuncs/auth/passwords.js").verify;
const genTokens = require("../../helperFuncs/auth/tokens.js").genTokens;

module.exports = router.post("/", async (req, res) => {
	try {
		if (!existsSync(`${process.cwd()}/data/users/${req.body.username}.json`)) return res.status(401).send("401 - Incorrect Username!");
		const userData = require(`${process.cwd()}/data/users/${req.body.username}.json`);
		if (!await verifyPassword(req.body.password, userData.password)) return res.status(401).send("401 - Incorrect Password!");
		genTokens(req, res, req.body.username);
	} catch (err) {
		console.log(err);
		return res.status(500).send("500 - Something Went Horribly Wrong!");
	}
});
