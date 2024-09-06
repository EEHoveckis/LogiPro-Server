const { existsSync, writeFileSync } = require("fs");
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");
const router = require('express').Router();

router.post("/", (req, res) => {
	const options = {
		username: req.headers.username,
		userLog: `Created New Warehouse - ${req.query.username}`,
		serverLog: `${req.headers.username} Created New Warehouse - ${req.query.username}`,
		required: ["username", "temptoken", "warehouse"],
		permissions: "newWarehouse"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (existsSync(`${process.cwd()}/data/warehouses/${req.query.warehouse}.json`)) return res.status(500).send("500 - Warehouse Already Exists");
		if (req.query.warehouse == undefined) return res.status(500).send("500 - Some Parameters Not Supplied");
		userLog(options);
		serverLog(options);
		writeFileSync(`${process.cwd()}/data/warehouses/${req.query.warehouse}.json`, JSON.stringify({}));
		return res.status(200).send("Warehouse Created");
	} else {
		return res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
