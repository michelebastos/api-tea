const authService = require('../services/authService');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const token = parts[1];
    const decoded = authService.verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
