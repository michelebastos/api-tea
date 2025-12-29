const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err.message);

  if (err.message === 'Credenciais inválidas') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message === 'Token inválido ou expirado') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message.includes('não encontrado') || err.message.includes('não encontrada')) {
    return res.status(404).json({ message: err.message });
  }

  if (err.message.includes('Intensidade')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
