const { randomBytes, scrypt } = require("crypto");

module.exports.hash = async function(password) {
	return new Promise((resolve, reject) => {
		const salt = randomBytes(32).toString("hex");
		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			resolve(salt + ":" + derivedKey.toString("hex"));
		});
	});
};

module.exports.verifyPassword = async function(receivedPass, userPass) {
	return new Promise((resolve, reject) => {
		const [salt, key] = userPass.split(":");
		scrypt(receivedPass, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			resolve(key == derivedKey.toString("hex"));
		});
	});
};
