const { client } = require("../../utils/mongo/connect.js");

module.exports.postUserLogs = async function(username, action) {
	await client.db("master").collection("userLogs").updateOne({ username: username }, {
		$set: {
			[Date.now()]: action
		}
	});
};

module.exports.postServerLogs = async function(username, action) {
	await client.db("master").collection("serverLogs").updateOne({ username: "SERVER" }, {
		$set: {
			[Date.now()]: `${username}_${action}`
		}
	});
};
