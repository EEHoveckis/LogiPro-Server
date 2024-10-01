const router = require("express").Router();
const getUser = require("../../utils/mongo/getUser.js");
const { verifyPassword } = require("../../utils/auth/passwords.js");
const { genTokens } = require("../../utils/auth/tokens.js");

module.exports = router.post("/", async (req, res) => {
	try {
		const userData = await getUser(req.body.username);
		if (!userData) return res.status(401).json({ errorCode: "usernameInvalid" });
		if (!await verifyPassword(req.body.password, userData.password)) return res.status(401).json({ errorCode: "passwordInvalid" });
		genTokens(req, res, req.body.username);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ errorCode: "unknownError" });
	}
});
