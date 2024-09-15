const { MongoClient, ServerApiVersion } = require("mongodb");
const { mongoPass } = require("../../data/options.json");
const uri = `mongodb+srv://master:${mongoPass}@testing.ii4f4.mongodb.net/?retryWrites=true&w=majority&appName=testing`;
const client = new MongoClient(uri, {
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
	} catch (err) {
		console.log("Error Connecting To MongoDB!");
	}

	process.on('SIGINT', async () => {
		console.log("Closing MongoDB connection...");
		await client.close();
		process.exit(0);
	});
};
