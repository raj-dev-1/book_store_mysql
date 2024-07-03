const jwt = require("jsonwebtoken");
const { userMessage } = require("./msg");
const { SECRET_KEY } = require("./constant");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(403).json({ message: userMessage.error.tokenMissing });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, token) => {
    if (err) {
      return res.status(403).json({ message: userMessage.error.unauthorized });
    }
    req.user = token.data;
    next();
  });
};

module.exports = verifyToken;
