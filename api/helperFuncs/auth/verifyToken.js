const jwt = require("jsonwebtoken");
const secretKey = require("../../../data/options.json").secretKey;

module.exports = function(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return res.status(401).send("401 - Not Authenticated");
	try {
		const decoded = jwt.verify(token, secretKey);
		next();
	} catch (err) {
		res.status(401).send("401 - Invalid Token");
	}
};
