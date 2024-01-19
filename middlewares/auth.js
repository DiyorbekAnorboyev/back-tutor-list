const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Unauthorized: Missing Authorization header");
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
    return res.status(401).send("Unauthorized: Invalid Authorization header format");
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.decodedToken = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = {
  authToken,
};