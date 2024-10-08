const router = require('express').Router();
const { verifyAccess } = require("../../utils/auth/tokens.js");
const { deleteTokens } = require("../../utils/mongo/tokenActions.js");
const { postUserLogs } = require("../../utils/mongo/userLogs.js");

module.exports = router.post("/", verifyAccess, async (req, res) => {
	deleteTokens(req.headers.username);
	postUserLogs(req.headers.username, "logout");
	return res.status(200).send("Logged Out!");
});
