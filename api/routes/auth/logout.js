const router = require('express').Router();
const { verifyAndDeleteTokens, deleteTokens } = require("../../utils/auth/tokens.js");

module.exports = router.post("/", verifyAndDeleteTokens, async (req, res) => {
	return res.status(200).send("Logged Out!");
});
