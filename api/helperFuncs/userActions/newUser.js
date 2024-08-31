// Function For New User Creation

const { scryptSync, randomBytes } = require('crypto');
const { writeFileSync } = require("fs");

module.exports = function(req) {
	const uniqueSalt = randomBytes(16).toString("hex");
	const userObject = {
		username: req.query.newusername,
		firstName: req.query.newfirstname,
		lastName: req.query.newlastname,
		password: scryptSync(req.query.newpassword, uniqueSalt, 64).toString("hex"),
		uniqueSalt: uniqueSalt,
		wrongPassword: 0,
		online: false,
		group: req.query.newgroup,
		temptoken: "",
		tokenValidTill: "",
		lastLogin: "",
		loginHistory: [],
		status: "OK"
	}

	writeFileSync(`${process.cwd()}/data/users/${req.query.newusername}.json`, JSON.stringify(userObject));
	return userObject;
};
