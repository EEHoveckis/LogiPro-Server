const app = require("express")();
const colors = require("colors");
const PORT = require("./data/options.json").port;

app.use(require("cors")());

app.options("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "DELETE,GET,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-Requested-With");
	res.send(200);
});

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path} - ${req.ip}`);
	next();
});

require("./api/router.js")(app);

app.all("*", (req, res) => {
	res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => console.log(`Listening On Port ${PORT}`.green.bold));
