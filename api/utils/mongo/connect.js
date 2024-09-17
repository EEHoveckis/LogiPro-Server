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
		await client.db("testing").command({ ping: 1 });
		console.log("Connected To MongoDB!");
		return client;
	} catch (err) {
		console.log("Error Connecting To MongoDB!");
	}
};

module.exports.client = client;
