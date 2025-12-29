const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const AuthHelper = require('../helpers/authHelper');
const { initializeDefaultUser } = require('../../src/data/seedData');

describe('REST API - Profiles', () => {
  let authHelper;
  let token;
  let createdProfileId;

  before(async () => {
    await initializeDefaultUser();
    authHelper = new AuthHelper();
    token = await authHelper.authenticate();
  });

  describe('POST /profiles', () => {
    it('deve retornar 401 quando não autenticado', (done) => {
      request(app)
        .post('/profiles')
        .send({
          name: 'João Silva',
          age: 12,
          supportLevel: 'moderado'
        })
        .expect(401, done);
    });

    it('deve criar perfil com dados válidos e retornar 201', (done) => {
      request(app)
        .post('/profiles')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          name: 'João Silva',
          age: 12,
          supportLevel: 'moderado',
          diagnosisDate: '2020-03-15',
          notes: 'Adora música'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name', 'João Silva');
          expect(res.body).to.have.property('age', 12);
          expect(res.body).to.have.property('supportLevel', 'moderado');
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.have.property('updatedAt');
          
          createdProfileId = res.body.id;
          done();
        });
    });

    it('deve retornar 400 quando nome não é fornecido', (done) => {
      request(app)
        .post('/profiles')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          age: 12,
          supportLevel: 'moderado'
        })
        .expect(400, done);
    });

    it('deve retornar 400 quando supportLevel é inválido', (done) => {
      request(app)
        .post('/profiles')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          name: 'João Silva',
          age: 12,
          supportLevel: 'invalido'
        })
        .expect(400, done);
    });
  });

  describe('GET /profiles', () => {
    it('deve retornar 401 quando não autenticado', (done) => {
      request(app)
        .get('/profiles')
        .expect(401, done);
    });

    it('deve retornar lista de perfis quando autenticado', (done) => {
      request(app)
        .get('/profiles')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1);
          done();
        });
    });
  });

  describe('GET /profiles/:id', () => {
    it('deve retornar perfil quando ID existe', (done) => {
      request(app)
        .get(`/profiles/${createdProfileId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id', createdProfileId);
          expect(res.body).to.have.property('name', 'João Silva');
          done();
        });
    });

    it('deve retornar 400 quando ID não é UUID válido', (done) => {
      request(app)
        .get('/profiles/id-invalido')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(400, done);
    });

    it('deve retornar 404 quando perfil não existe', (done) => {
      request(app)
        .get('/profiles/123e4567-e89b-12d3-a456-426614174999')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(404, done);
    });
  });

  describe('PUT /profiles/:id', () => {
    it('deve atualizar perfil e retornar 200', (done) => {
      request(app)
        .put(`/profiles/${createdProfileId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          name: 'João Silva Atualizado',
          age: 13
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('name', 'João Silva Atualizado');
          expect(res.body).to.have.property('age', 13);
          expect(res.body).to.have.property('updatedAt');
          done();
        });
    });

    it('deve retornar 404 quando perfil não existe', (done) => {
      request(app)
        .put('/profiles/123e4567-e89b-12d3-a456-426614174999')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          name: 'Nome Atualizado'
        })
        .expect(404, done);
    });
  });

  describe('DELETE /profiles/:id', () => {
    it('deve excluir perfil e retornar 200', (done) => {
      request(app)
        .delete(`/profiles/${createdProfileId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('deve retornar 404 quando tentar excluir perfil já excluído', (done) => {
      request(app)
        .delete(`/profiles/${createdProfileId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(404, done);
    });
  });
});
