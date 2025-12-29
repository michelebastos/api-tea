const request = require('supertest');
const app = require('../../src/app');

/**
 * Helper para autenticação em testes de integração
 * Gera token JWT real via endpoint de login
 */
class AuthHelper {
  constructor() {
    this.token = null;
  }

  async authenticate() {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@autismo.com',
        password: '123456'
      });

    if (response.status === 200 && response.body.token) {
      this.token = response.body.token.replace('Bearer ', '');
      return this.token;
    }

    throw new Error('Falha na autenticação de teste');
  }

  getAuthHeader() {
    if (!this.token) {
      throw new Error('Token não disponível. Execute authenticate() primeiro.');
    }
    return `Bearer ${this.token}`;
  }

  reset() {
    this.token = null;
  }
}

module.exports = AuthHelper;
