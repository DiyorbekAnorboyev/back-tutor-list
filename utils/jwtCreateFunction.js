const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign({userId}, process.env.TOKEN, { expiresIn: "30d" });
}

module.exports = {createToken};
