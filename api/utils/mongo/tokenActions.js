const { client } = require("../../utils/mongo/connect.js");

module.exports.refreshTokens = async function(username) {
	const userData = await client.db("master").collection("users").findOne({ username: username });
	return userData;
};

module.exports.deleteTokens = async function(username) {
	await client.db("master").collection("users").updateOne({ username: username }, { $set: { accessToken: "", refreshToken: "" } });
};

module.exports.postTokens = async function(username, accessToken, refreshToken) {
	await client.db("master").collection("users").updateOne({ username: username }, { $set: { accessToken: accessToken, refreshToken: refreshToken } });
};