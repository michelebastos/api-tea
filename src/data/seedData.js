const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

/**
 * Inicializa o usuário admin padrão ao iniciar o servidor
 */
async function initializeDefaultUser() {
  const adminEmail = 'admin@autismo.com';
  const adminPassword = '123456';

  const existingUser = userRepository.findByEmail(adminEmail);
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin'
    });

    console.log('Usuário admin criado com sucesso');
    console.log('Email: admin@autismo.com');
    console.log('Senha: 123456');
  }
}

module.exports = { initializeDefaultUser };
