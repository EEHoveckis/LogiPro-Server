const app = require("express")();
const connectMongo = require("./api/mongo/connectMongo.js");
const PORT = require("./data/options.json").port;

(async function() {
	app.use(require("cors")());
	app.options("*", (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
		res.header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-Requested-With");
		res.send(200);
	});

	require("./api/router.js")(app);

	app.all("*", (req, res) => {
		res.status(404).send("404 - Not Found");
	});

	await connectMongo();
	app.listen(PORT, () => console.log(`Server Listening On Port ${PORT}`));
})();
