const jwt = require("jsonwebtoken");

check_token = token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = check_token;
