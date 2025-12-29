require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  env: process.env.NODE_ENV || 'development'
};
