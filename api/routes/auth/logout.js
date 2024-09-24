const router = require('express').Router();
const { verifyAccess } = require("../../utils/auth/tokens.js");
const { deleteTokens } = require("../../utils/mongo/tokenActions.js");

module.exports = router.post("/", verifyAccess, async (req, res) => {
	deleteTokens(req.headers.username);
	return res.status(200).send("Logged Out!");
});
