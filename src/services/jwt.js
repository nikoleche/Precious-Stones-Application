const jwt = require("jsonwebtoken");

const secret = "some strange secret";

function generateToken(userData) {
  const payload = {
    email: userData.email,
    _id: userData._id,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: "24h",
  });
  return token;
}

function verifyToken(token) {
  const data = jwt.verify(token, secret);

  return data;
}

module.exports = {
  generateToken,
  verifyToken,
};
