const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const AuthHelper = require('../helpers/authHelper');
const { initializeDefaultUser } = require('../../src/data/seedData');

describe('REST API - Routines', () => {
  let authHelper;
  let token;
  let testProfileId;
  let createdRoutineId;

  before(async () => {
    await initializeDefaultUser();
    authHelper = new AuthHelper();
    token = await authHelper.authenticate();

    // Criar perfil de teste
    const profileRes = await request(app)
      .post('/profiles')
      .set('Authorization', authHelper.getAuthHeader())
      .send({
        name: 'Perfil Teste Rotinas',
        age: 10,
        supportLevel: 'leve'
      });
    
    testProfileId = profileRes.body.id;
  });

  describe('POST /routines', () => {
    it('deve retornar 401 quando não autenticado', (done) => {
      request(app)
        .post('/routines')
        .send({
          profileId: testProfileId,
          title: 'Escovar os dentes'
        })
        .expect(401, done);
    });

    it('deve criar rotina com dados válidos e retornar 201', (done) => {
      request(app)
        .post('/routines')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId,
          title: 'Escovar os dentes',
          description: 'Após o café da manhã',
          time: '08:00',
          dayOfWeek: 'segunda'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('profileId', testProfileId);
          expect(res.body).to.have.property('title', 'Escovar os dentes');
          expect(res.body).to.have.property('time', '08:00');
          expect(res.body).to.have.property('createdAt');
          
          createdRoutineId = res.body.id;
          done();
        });
    });

    it('deve retornar 400 quando profileId não é UUID válido', (done) => {
      request(app)
        .post('/routines')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: 'id-invalido',
          title: 'Rotina Teste'
        })
        .expect(400, done);
    });

    it('deve retornar 400 quando título não é fornecido', (done) => {
      request(app)
        .post('/routines')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId
        })
        .expect(400, done);
    });

    it('deve retornar 400 quando time tem formato inválido', (done) => {
      request(app)
        .post('/routines')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId,
          title: 'Rotina Teste',
          time: '25:00'
        })
        .expect(400, done);
    });

    it('deve retornar 400 quando profileId não existe', (done) => {
      request(app)
        .post('/routines')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: '123e4567-e89b-12d3-a456-426614174999',
          title: 'Rotina Teste'
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Perfil não encontrado');
          done();
        });
    });
  });

  describe('GET /routines', () => {
    it('deve retornar 401 quando não autenticado', (done) => {
      request(app)
        .get('/routines')
        .expect(401, done);
    });

    it('deve retornar lista de rotinas quando autenticado', (done) => {
      request(app)
        .get('/routines')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('deve filtrar rotinas por profileId', (done) => {
      request(app)
        .get(`/routines?profileId=${testProfileId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          res.body.forEach(routine => {
            expect(routine).to.have.property('profileId', testProfileId);
          });
          done();
        });
    });
  });

  describe('GET /routines/:id', () => {
    it('deve retornar rotina quando ID existe', (done) => {
      request(app)
        .get(`/routines/${createdRoutineId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id', createdRoutineId);
          expect(res.body).to.have.property('title', 'Escovar os dentes');
          done();
        });
    });

    it('deve retornar 404 quando rotina não existe', (done) => {
      request(app)
        .get('/routines/123e4567-e89b-12d3-a456-426614174999')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(404, done);
    });
  });

  describe('PUT /routines/:id', () => {
    it('deve atualizar rotina e retornar 200', (done) => {
      request(app)
        .put(`/routines/${createdRoutineId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          title: 'Rotina Atualizada',
          time: '09:00'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('title', 'Rotina Atualizada');
          expect(res.body).to.have.property('time', '09:00');
          done();
        });
    });
  });

  describe('DELETE /routines/:id', () => {
    it('deve excluir rotina e retornar 200', (done) => {
      request(app)
        .delete(`/routines/${createdRoutineId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});
