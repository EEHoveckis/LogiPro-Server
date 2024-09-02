const { existsSync, writeFileSync } = require("fs");

module.exports = function(options) {
	if (existsSync(`${process.cwd()}/data/logs/serverLogs.json`)) {
		const serverLogs = require(`${process.cwd()}/data/logs/serverLogs.json`);
		Object.assign(serverLogs, {
        [Date.now()]: options.serverLog
		});

		writeFileSync(`${process.cwd()}/data/logs/serverLogs.json`, JSON.stringify(serverLogs));
	} else {
		const serverLogs = {
        [Date.now()]: options.serverLog
		};
		writeFileSync(`${process.cwd()}/data/logs/serverLogs.json`, JSON.stringify(serverLogs));
	}
};
