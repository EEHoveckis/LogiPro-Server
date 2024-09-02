const { existsSync, writeFileSync } = require("fs");

module.exports = function(options) {
	if (existsSync(`${process.cwd()}/data/logs/${options.username}.json`)) {
		const userLogs = require(`${process.cwd()}/data/logs/${options.username}.json`);
		Object.assign(userLogs, {
        [Date.now()]: options.userLog
		});

		writeFileSync(`${process.cwd()}/data/logs/${options.username}.json`, JSON.stringify(userLogs));
	} else {
		const userLogs = {
        [Date.now()]: options.userLog
		};
		writeFileSync(`${process.cwd()}/data/logs/${options.username}.json`, JSON.stringify(userLogs));
	}
};
