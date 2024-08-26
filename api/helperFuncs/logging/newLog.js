const { existsSync, writeFileSync } = require("fs");

module.exports = function(req) {
	if (req.baseUrl == "/api/login") { // Login
		addLog(req, "Logged In!");
	} else if (req.baseUrl == "/api/logout") { // Logout
		addLog(req, "Logged Out!");
	} else {
		// Nothing here for now...
	}

	function addLog(req, message) {
		if (existsSync(`${process.cwd()}/data/logs/${req.headers.username}.json`)) { // Logs exist, add new entry.
			const userLogs = require(`${process.cwd()}/data/logs/${req.headers.username}.json`);
			Object.assign(userLogs, {
        [Date.now()]: message
			});

			writeFileSync(`${process.cwd()}/data/logs/${req.headers.username}.json`, JSON.stringify(userLogs));
		} else { // Logs don't exist, make file and add entry.
			const userLogs = {
        [Date.now()]: message
			};
			writeFileSync(`${process.cwd()}/data/logs/${req.headers.username}.json`, JSON.stringify(userLogs));
		}
	}
};
