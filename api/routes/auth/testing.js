const router = require('express').Router();
const { verifyAccess } = require("../../utils/auth/tokens.js");
const checkPermissions = require("../../utils/auth/permissions.js");

module.exports = router.post("/", verifyAccess, checkPermissions("TEST"), async (req, res) => {
	return res.status(200).send("Ping, Pong! All Good!");
});
