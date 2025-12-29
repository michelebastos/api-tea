const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { initializeDefaultUser } = require('../../src/data/seedData');

describe('REST API - Authentication', () => {
  before(async () => {
    await initializeDefaultUser();
  });

  describe('POST /auth/login', () => {
    it('deve retornar 200 e token com credenciais válidas', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'admin@autismo.com',
          password: '123456'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
          expect(res.body.token).to.include('Bearer');
          done();
        });
    });

    it('deve retornar 401 com email inválido', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'invalido@email.com',
          password: '123456'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Credenciais inválidas');
          done();
        });
    });

    it('deve retornar 401 com senha inválida', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'admin@autismo.com',
          password: 'senhaerrada'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Credenciais inválidas');
          done();
        });
    });

    it('deve retornar 400 quando email não é fornecido', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          password: '123456'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('deve retornar 400 quando senha não é fornecida', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'admin@autismo.com'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('deve retornar 400 quando email é inválido', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'email-invalido',
          password: '123456'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Erro de validação');
          done();
        });
    });
  });
});
