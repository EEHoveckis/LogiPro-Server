const { MongoClient, ServerApiVersion } = require("mongodb");
const { mongoURI } = require("../../../data/options.json");
const client = new MongoClient(mongoURI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

module.exports = async function() {
	try {
		await client.connect();
		await client.db("master").command({ ping: 1 });
		console.log("Connected To MongoDB!");
		await client.db("master").collection("serverLogs").updateOne({ username: "SERVER" }, {
			$set: {
				[Date.now()]: "init_Success"
			}
		});
		return client;
	} catch (err) {
		console.log("Error Connecting To MongoDB!");
	}
};

module.exports.client = client;
