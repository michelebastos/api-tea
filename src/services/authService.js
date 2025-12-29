const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/env');

class AuthService {
  async login(email, password) {
    const user = userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return { token: `Bearer ${token}` };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = new AuthService();
