const jwt = require("jsonwebtoken");
const { accessKey, refreshKey } = require("../../../data/options.json");
const { postTokens } = require("../mongo/tokenActions.js");

// Generates New JWT Tokens & Posts Them To MongoDB
module.exports.genTokens = function(req, res, username) {
	try {
		const accessToken = jwt.sign({ username: username, type: "ACCESS" }, accessKey, { expiresIn: "30m" });
		const refreshToken = jwt.sign({ username: username, type: "REFRESH" }, refreshKey, { expiresIn: "7d" });
		postTokens(username, accessToken, refreshToken);
		return res.status(200).json({ accessToken, refreshToken });
	} catch (err) {
		return res.status(500).json({ errorCode: "unknownError" });
	}
};

// Checks Access Token
module.exports.verifyAccess = function(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return res.status(401).json({ errorCode: "noAccessToken" });
	try {
		const accessToken = jwt.verify(token, accessKey);
		next();
	} catch (err) {
		if (err.name == "TokenExpiredError") return res.status(403).json({ errorCode: "accessTokenExpired" });
		else return res.status(401).json({ errorCode: "invalidAccessToken" });
	}
};

// Checks Refresh Token
module.exports.verifyRefresh = function(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return res.status(401).json({ errorCode: "noRefreshToken" });
	try {
		const refreshToken = jwt.verify(token, refreshKey);
		next();
	} catch (err) {
		if (err.name == "TokenExpiredError") return res.status(403).json({ errorCode: "refreshTokenExpired" });
		return res.status(403).json({ errorCode: "invalidRefreshToken" });
	}
};
