const { client } = require("../../utils/mongo/connect.js");

module.exports.postUserLogs = async function(username, action) {
	const userData = await client.db("master").collection("userLogs").updateOne({ username: username }, {
		$set: {
			[Date.now()]: action
		}
	});
};
