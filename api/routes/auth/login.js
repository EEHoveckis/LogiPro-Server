const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { existsSync } = require("fs");
const verifyPassword = require("../../helperFuncs/auth/passwords.js").verify;
const tokenKey = require("../../../data/options.json").tokenKey;

router.post("/", async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!existsSync(`${process.cwd()}/data/users/${username}.json`)) return res.status(401).send("401 - Incorrect Username!");
		const userData = require(`${process.cwd()}/data/users/${username}.json`);
		const passwordMatch = await verifyPassword(password, userData.password);
		if (!passwordMatch) return res.status(401).send("401 - Incorrect Password!");
		const token = jwt.sign({ username: username }, tokenKey, { expiresIn: "1h" });
		return res.status(200).json({ token });
	} catch (err) {
		return res.status(500).send("500 - Something Went Horribly Wrong!");
	}
});

module.exports = router;
