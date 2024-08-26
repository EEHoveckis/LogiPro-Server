const { writeFileSync, mkdirSync, existsSync } = require("fs");
const { scryptSync, randomBytes } = require('crypto');
const colors = require("colors");
const prompt = require("prompt");
const { version } = require("./package.json");

console.log(`LogiPro Server ${version}\nStarting Setup...\n`);

if (existsSync(`${process.cwd()}/data/options.json`)) {
	return console.log("ERROR! Setup Already Finished!".red.bold);
} else {
	prompt.message = "";
	prompt.delimiter = "";

	var schema = {
		properties: {
			port: {
				description: "Select Server Port. (3000):".cyan.bold,
				pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
				message: "Port Must Be A Number From 1 - 65535!".yellow.bold,
				required: false,
				default: 3000
			},
			databaseType: {
				description: "Server Database Type. (CLOUD / LOCAL):".cyan.bold,
				pattern: /^CLOUD$|^LOCAL$/,
				message: "Database Type Must Be Either CLOUD Or LOCAL!".yellow.bold,
				required: false
			},
			firstName: {
				description: "Enter Your First Name:".cyan.bold,
				pattern: /^[a-zA-Z\-\s]+$/,
				message: "Name Can Only Be Letters, Spaces Or Dashes!".yellow.bold,
				required: true
			},
			lastName: {
				description: "Enter Your Surname:".cyan.bold,
				pattern: /^[a-zA-Z\-\s]+$/,
				message: "Surname Can Only Be Letters, Spaces Or Dashes!".yellow.bold,
				required: true
			},
			username: {
				description: "Enter Your Username:".cyan.bold,
				pattern: /^[a-zA-Z\-0-9]+$/,
				message: "Username Can Only Be Letters, Dashes Or Numbers!".yellow.bold,
				required: true
			},
			password: {
				description: "Enter The Password You Will Be Using:".cyan.bold,
				hidden: true,
				replace: "*",
				required: true
			}
		}
	};

	prompt.start();

	prompt.get(schema, function(err, result) {
		let options = {
			port: result.port,
			databaseType: result.databaseType
		}
		mkdirSync("./data");
		mkdirSync("./data/users");
		writeFileSync("./data/options.json", JSON.stringify(options));

		let uniqueSalt = randomBytes(16).toString("hex");
		let userObject = {
			username: result.username,
			firstName: result.firstName,
			lastName: result.lastName,
			password: scryptSync(result.password, uniqueSalt, 64).toString("hex"),
			uniqueSalt: uniqueSalt,
			wrongPassword: 0,
			group: "ADMIN",
			online: false,
			tempToken: "",
			tokenValidTill: "",
			lastLogin: "",
			loginHistory: [],
			status: "OK"
		}
		writeFileSync(`./data/users/${userObject.username}.json`, JSON.stringify(userObject));
		console.log("Setup Finished! You Can Run \"npm run start\" Now!".green.bold);
	});
}
