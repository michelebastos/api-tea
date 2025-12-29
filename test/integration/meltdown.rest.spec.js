const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const AuthHelper = require('../helpers/authHelper');
const { initializeDefaultUser } = require('../../src/data/seedData');

describe('REST API - Meltdowns', () => {
  let authHelper;
  let testProfileId;
  let createdMeltdownId;

  before(async () => {
    await initializeDefaultUser();
    authHelper = new AuthHelper();
    await authHelper.authenticate();

    // Criar perfil de teste
    const profileRes = await request(app)
      .post('/profiles')
      .set('Authorization', authHelper.getAuthHeader())
      .send({
        name: 'Perfil Teste Crises',
        age: 8,
        supportLevel: 'alto'
      });
    
    testProfileId = profileRes.body.id;
  });

  describe('POST /meltdowns', () => {
    it('deve retornar 401 quando não autenticado', (done) => {
      request(app)
        .post('/meltdowns')
        .send({
          profileId: testProfileId,
          trigger: 'barulho alto',
          intensity: 4,
          occurredAt: '2024-12-29T10:00:00.000Z'
        })
        .expect(401, done);
    });

    it('deve criar registro de crise com dados válidos', (done) => {
      request(app)
        .post('/meltdowns')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId,
          trigger: 'barulho alto',
          description: 'Durante festa de aniversário',
          intensity: 4,
          occurredAt: '2024-12-29T10:00:00.000Z'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('profileId', testProfileId);
          expect(res.body).to.have.property('trigger', 'barulho alto');
          expect(res.body).to.have.property('intensity', 4);
          expect(res.body).to.have.property('occurredAt');
          
          createdMeltdownId = res.body.id;
          done();
        });
    });

    it('deve retornar 400 quando intensidade é menor que 1', (done) => {
      request(app)
        .post('/meltdowns')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId,
          trigger: 'teste',
          intensity: 0,
          occurredAt: '2024-12-29T10:00:00.000Z'
        })
        .expect(400, done);
    });

    it('deve retornar 400 quando intensidade é maior que 5', (done) => {
      request(app)
        .post('/meltdowns')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId,
          trigger: 'teste',
          intensity: 6,
          occurredAt: '2024-12-29T10:00:00.000Z'
        })
        .expect(400, done);
    });

    it('deve retornar 400 quando trigger não é fornecido', (done) => {
      request(app)
        .post('/meltdowns')
        .set('Authorization', authHelper.getAuthHeader())
        .send({
          profileId: testProfileId,
          intensity: 3,
          occurredAt: '2024-12-29T10:00:00.000Z'
        })
        .expect(400, done);
    });
  });

  describe('GET /meltdowns', () => {
    it('deve retornar 401 quando não autenticado', (done) => {
      request(app)
        .get('/meltdowns')
        .expect(401, done);
    });

    it('deve retornar lista de crises quando autenticado', (done) => {
      request(app)
        .get('/meltdowns')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('deve filtrar crises por profileId', (done) => {
      request(app)
        .get(`/meltdowns?profileId=${testProfileId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          res.body.forEach(meltdown => {
            expect(meltdown).to.have.property('profileId', testProfileId);
          });
          done();
        });
    });

    it('deve filtrar crises por data', (done) => {
      request(app)
        .get('/meltdowns?startDate=2024-01-01&endDate=2024-12-31')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /meltdowns/:id', () => {
    it('deve retornar crise quando ID existe', (done) => {
      request(app)
        .get(`/meltdowns/${createdMeltdownId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('id', createdMeltdownId);
          expect(res.body).to.have.property('trigger', 'barulho alto');
          expect(res.body).to.have.property('intensity', 4);
          done();
        });
    });

    it('deve retornar 404 quando crise não existe', (done) => {
      request(app)
        .get('/meltdowns/123e4567-e89b-12d3-a456-426614174999')
        .set('Authorization', authHelper.getAuthHeader())
        .expect(404, done);
    });
  });

  describe('DELETE /meltdowns/:id', () => {
    it('deve excluir crise e retornar 200', (done) => {
      request(app)
        .delete(`/meltdowns/${createdMeltdownId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('deve retornar 404 ao tentar excluir crise já excluída', (done) => {
      request(app)
        .delete(`/meltdowns/${createdMeltdownId}`)
        .set('Authorization', authHelper.getAuthHeader())
        .expect(404, done);
    });
  });
});
