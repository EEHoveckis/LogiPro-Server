const { client } = require("../../utils/mongo/connect.js");

module.exports.deleteTokens = async function(username) {
	await client.db("master").collection("users").updateOne({ username: username }, { $set: { accessToken: "", refreshToken: "" } });
};

module.exports.postTokens = async function(username, accessToken, refreshToken) {
	await client.db("master").collection("users").updateOne({ username: username }, { $set: { accessToken: accessToken, refreshToken: refreshToken } });
};
