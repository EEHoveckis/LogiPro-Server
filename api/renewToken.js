const { writeFileSync } = require("fs");

module.exports = function(req) {
	const authData = require(`${process.cwd()}/data/users/${req.headers.username}.json`);
	if (authData.tokenValidTill - Date.now() < 10 * 60 * 1000 && authData.tokenValidTill - Date.now() > 0) {
		authData.tokenValidTill = `${Date.now() + 1 * 60 * 60 * 1000}`;
		writeFileSync(`${process.cwd()}/data/users/${req.headers.username}.json`, JSON.stringify(authData));
	} else return;
};
