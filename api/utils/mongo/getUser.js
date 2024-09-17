const { client } = require("../../utils/mongo/connect.js");

module.exports = async function(username) {
	const userData = await client.db("master").collection("users").findOne({ username: username });
	return userData;
};
