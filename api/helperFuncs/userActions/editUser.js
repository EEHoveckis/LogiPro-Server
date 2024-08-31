// Function For User Info Editing

const { scryptSync, randomBytes } = require('crypto');
const { writeFileSync, rename } = require("fs");

module.exports = function(req) {
	const oldUserObject = require(`${process.cwd()}/data/users/${req.query.username}.json`);

	let newUserObject = {
		username: (req.query.newusername === undefined) ? oldUserObject.username : req.query.newusername,
		firstName: (req.query.newfirstname === undefined) ? oldUserObject.firstName : req.query.newfirstname,
		lastName: (req.query.newlastname === undefined) ? oldUserObject.lastName : req.query.newlastname,
		password: (req.query.newpassword === undefined) ? oldUserObject.password : scryptSync(req.query.newpassword, oldUserObject.uniqueSalt, 64).toString("hex"),
		uniqueSalt: oldUserObject.uniqueSalt,
		wrongPassword: oldUserObject.wrongPassword,
		group: (req.query.newgroup === undefined) ? oldUserObject.group : req.query.newgroup,
		temptoken: oldUserObject.tempToken,
		tokenValidTill: oldUserObject.tokenValidTill,
		lastLogin: oldUserObject.lastLogin,
		status: "OK"
	}

	if (req.query.username != req.query.newusername && req.query.newusername != undefined) {
		rename(`${process.cwd()}/data/users/${req.query.username}.json`, `${process.cwd()}/data/users/${req.query.newusername}.json`);
		writeFileSync(`${process.cwd()}/data/users/${req.query.newusername}.json`, JSON.stringify(newUserObject));
		return newUserObject;
	} else {
		writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(newUserObject));
		return newUserObject;
	}
};
