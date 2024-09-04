const { scryptSync, randomBytes } = require('crypto');
const { writeFileSync } = require("fs");

module.exports = function(req) {
	const uniqueSalt = randomBytes(16).toString("hex");
	const userObject = {
		username: req.query.username,
		firstName: req.query.firstname,
		lastName: req.query.lastname,
		password: scryptSync(req.query.password, uniqueSalt, 64).toString("hex"),
		uniqueSalt: uniqueSalt,
		wrongPassword: 0,
		online: false,
		permissions: req.query.permissions.replace(/ +/, "").split(","),
		temptoken: "",
		tokenValidTill: "",
		lastLogin: "",
		loginHistory: [],
		status: "OK"
	}

	writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(userObject));
	return userObject;
};
