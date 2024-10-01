const router = require('express').Router();
const { verifyRefresh, genTokens } = require("../../utils/auth/tokens.js");

module.exports = router.post("/", verifyRefresh, async (req, res) => {
	genTokens(req, res, req.headers.username);
});