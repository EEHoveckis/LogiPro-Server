const app = require("express")();
const connectMongo = require("./api/utils/mongo/connect.js");
const PORT = require("./data/options.json").port;

(async function() {
	app.use(require("cors")());
	app.options("*", (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "DELETE, GET, PATCH, POST, PUT");
		res.header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-Requested-With");
		res.send(200);
	});

	const client = await connectMongo();
	require("./api/router.js")(app, client);

	app.all("*", (req, res) => {
		res.status(404).send("404 - Not Found");
	});

	app.listen(PORT, () => console.log(`Server Listening On Port ${PORT}`));

	process.on("SIGINT", async () => {
		console.log("Server Shutting Down\nClosing MongoDB connection...");
		await client.close();
		process.exit(0);
	});
})();
