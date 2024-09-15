const jwt = require("jsonwebtoken");
const accessKey = require("../../../data/options.json").accessKey;
const refreshKey = require("../../../data/options.json").refreshKey;

module.exports.genTokens = function(req, res, username) {
	try {
		const accessToken = jwt.sign({ username: username }, accessKey, { expiresIn: "30m" });
		const refreshToken = jwt.sign({ username: username }, refreshKey, { expiresIn: "7d" }); // TODO: Make this usable
		return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
	} catch (err) {
		res.status(500).send("500 - Something Went Wrong!");
	}
};

module.exports.verify = function(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return res.status(401).send("401 - Not Authenticated");
	try {
		const decoded = jwt.verify(token, accessKey);
		next();
	} catch (err) {
		console.log(err);
		res.status(401).send("401 - Invalid Token");
	}
};
