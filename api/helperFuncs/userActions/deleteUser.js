const { writeFileSync } = require("fs");

module.exports = function(req) {
	const userObject = require(`${process.cwd()}/data/users/${req.query.username}.json`);
	userObject.status = "DELETED";
	writeFileSync(`${process.cwd()}/data/users/${req.query.username}.json`, JSON.stringify(userObject));
	return "200 - User Marked For Deletion";
};
