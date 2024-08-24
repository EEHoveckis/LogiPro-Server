const express = require("express");
const cors = require("cors");
const colors = require("colors");
const options = require("./data/options.json");

const app = express();
const PORT = options.port || 3000;

app.use(cors());

app.options("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "DELETE,GET,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-Requested-With");
	res.send(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path} - ${req.ip}`);
	next();
});

const loginPath = require("./api/login");
app.use("/api/login", loginPath);

const logoutPath = require("./api/logout");
app.use("/api/logout", logoutPath);

const userManagement = require("./api/users");
app.use("/api/users", userManagement);

// Catch All Route
app.all("*", (req, res) => {
	res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => console.log(`Listening On Port ${PORT}`.green.bold));
