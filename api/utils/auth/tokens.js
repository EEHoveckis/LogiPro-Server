const jwt = require("jsonwebtoken");
const { accessKey, refreshKey } = require("../../../data/options.json");
const { deleteTokens, postTokens, refreshTokens } = require("../mongo/tokenActions.js");

module.exports.genTokens = function(req, res, username) {
	try {
		const accessToken = jwt.sign({ username: username }, accessKey, { expiresIn: "1m" });
		const refreshToken = jwt.sign({ username: username }, refreshKey, { expiresIn: "7d" }); // TODO: Make this usable
		postTokens(username, accessToken, refreshToken);
		return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
	} catch (err) {
		return res.status(500).send("500 - Something Went Wrong!");
	}
};

// TODO: Implement refresh token too
/* F this for now
module.exports.verifyTokens = function(req, res, next) {
	const tokens = req.header("Authorization").split("|");
	if (!tokens) return res.status(401).send("401 - Not Authenticated");
	try {
		const accessToken = jwt.verify(tokens[0], accessKey);
		next();
	} catch (err) {
		if (err.name == "TokenExpiredError") {
			module.exports.refreshTokens(req, res, tokens)
		}
	}
};
*/

module.exports.verifyAndDeleteTokens = function(req, res, next) {
	const token = req.header("accesstoken");
	if (!token) return res.status(401).send("401 - Not Authenticated");
	try {
		const accessToken = jwt.verify(token, accessKey);
		deleteTokens(accessToken.username);
	} catch (err) {
		return res.status(401).send("401 - Invalid Token");
	}
	next();
};

module.exports.refreshTokens = function(req, res, tokens) {
	const refreshToken = jwt.verify(tokens[1], refreshKey);
};
