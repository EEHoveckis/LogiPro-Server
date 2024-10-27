const router = require('express').Router();
const { verifyRefresh, genTokens } = require("../../utils/auth/tokens.js");
const { postUserLogs, postServerLogs } = require("../../utils/mongo/actionLogs.js");

module.exports = router.post("/", verifyRefresh, async (req, res) => {
	genTokens(req, res, req.headers.username);
	postUserLogs(req.headers.username, "tokenRefresh");
	postServerLogs(req.headers.username, "tokenRefresh");
});
