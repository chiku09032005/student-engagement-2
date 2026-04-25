const jwt = require('jsonwebtoken');

const generateJWT = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');
  } catch (error) {
    return null;
  }
};

const decodeJWT = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateJWT,
  verifyJWT,
  decodeJWT,
};
