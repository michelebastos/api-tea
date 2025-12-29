const app = require('./app');
const config = require('./config/env');
const { initializeDefaultUser } = require('./data/seedData');

const startServer = async () => {
  try {
    // Inicializar usuário admin
    await initializeDefaultUser();

    // Iniciar servidor
    app.listen(config.port, () => {
      console.log('\n==============================================');
      console.log('API de Apoio ao Autismo');
      console.log('==============================================');
      console.log(`Servidor rodando na porta ${config.port}`);
      console.log(`Documentação: http://localhost:${config.port}/swagger`);
      console.log(`API: http://localhost:${config.port}`);
      console.log('==============================================');
      console.log('Armazenamento em memória ativo');
      console.log('   Os dados serão perdidos ao reiniciar o servidor');
      console.log('==============================================\n');
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
