const { existsSync, rm } = require("fs");
const auth = require("../../helperFuncs/authentification/auth.js");
const userLog = require("../../helperFuncs/logging/userLog.js");
const serverLog = require("../../helperFuncs/logging/serverLog.js");
const router = require('express').Router();

router.delete("/", (req, res) => {
	const options = {
		username: req.headers.username,
		userLog: `Deleted Warehouse - ${req.query.username}`,
		serverLog: `${req.headers.username} Deleted Warehouse - ${req.query.username}`,
		required: ["username", "temptoken", "warehouse"],
		permissions: "deleteWarehouse"
	};

	const authReturn = auth(req, options);
	if (authReturn == 200) {
		if (!existsSync(`${process.cwd()}/data/warehouses/${req.query.warehouse}.json`)) return res.status(500).send("500 - Warehouse Does Not Exist!");
		if (req.query.warehouse == undefined) return res.status(500).send("500 - Warehouse Name Not Supplied!");
		userLog(options);
		serverLog(options);
		rm(`${process.cwd()}/data/warehouses/${req.query.warehouse}.json`, (err) => console.log(err));
		return res.status(200).send("Warehouse Deleted!");
	} else {
		return res.status(authReturn[0]).send(authReturn[1]);
	}
});

module.exports = router;
