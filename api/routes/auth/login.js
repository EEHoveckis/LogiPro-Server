const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { existsSync } = require("fs");
const verify = require("../../helperFuncs/auth/passwords.js").verify;
const secretKey = require("../../../data/options.json").secretKey;

router.post("/", async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!existsSync(`${process.cwd()}/data/users/${username}.json`)) return res.status(401).send("401 - Incorrect Username!");
		const userData = require(`${process.cwd()}/data/users/${username}.json`);
		const passwordMatch = await verify(password, userData.password);
		if (!passwordMatch) return res.status(401).send("401 - Incorrect Password!");
		const token = jwt.sign(userData, secretKey, { expiresIn: "1h" });
		return res.status(200).json({ token });
	} catch (err) {
		console.log(err);
		return res.status(500).send("500 - Something Went Horribly Wrong!");
	}
});

module.exports = router;
