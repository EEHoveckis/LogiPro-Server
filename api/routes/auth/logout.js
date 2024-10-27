const router = require('express').Router();
const { verifyAccess } = require("../../utils/auth/tokens.js");
const { deleteTokens } = require("../../utils/mongo/tokenActions.js");
const { postUserLogs, postServerLogs } = require("../../utils/mongo/actionLogs.js");

module.exports = router.post("/", verifyAccess, async (req, res) => {
	deleteTokens(req.headers.username);
	postUserLogs(req.headers.username, "logout");
	postServerLogs(req.headers.username, "logout");
	return res.status(200).send("Logged Out!");
});
