const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../../src/app');
const store = require('../../src/data/store');
const AuthHelper = require('../helpers/authHelper');

describe('Activity REST API - Integration Tests', () => {
  let authToken;
  let testProfileId;

  beforeEach(() => {
    store.reset();
    authToken = AuthHelper.generateTestToken();
    
    testProfileId = uuidv4();
    const profile = {
      id: testProfileId,
      name: 'João',
      dateOfBirth: '2010-05-15',
      diagnosis: 'TEA Nível 1',
      userId: uuidv4()
    };
    store.profiles.push(profile);
  });

  describe('POST /activities', () => {
    it('deve criar uma nova atividade', async () => {
      const activityData = {
        profileId: testProfileId,
        name: 'Terapia ocupacional',
        objective: 'Melhorar coordenação motora',
        durationMinutes: 60,
        professional: 'Dr. Silva'
      };

      const response = await request(app)
        .post('/activities')
        .set('Authorization', authToken)
        .send(activityData)
        .expect(201);

      expect(response.body).to.have.property('id');
      expect(response.body.name).to.equal(activityData.name);
      expect(response.body.profileId).to.equal(testProfileId);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const activityData = {
        profileId: testProfileId,
        name: 'Terapia ocupacional',
        durationMinutes: 60
      };

      await request(app)
        .post('/activities')
        .send(activityData)
        .expect(401);
    });

    it('deve retornar 400 com dados inválidos', async () => {
      const response = await request(app)
        .post('/activities')
        .set('Authorization', authToken)
        .send({})
        .expect(400);

      expect(response.body).to.have.property('errors');
    });
  });

  describe('GET /activities', () => {
    beforeEach(() => {
      store.activities.push(
        {
          id: uuidv4(),
          profileId: testProfileId,
          name: 'Terapia ocupacional',
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          profileId: testProfileId,
          name: 'Fonoaudiologia',
          createdAt: new Date()
        }
      );
    });

    it('deve retornar todas as atividades', async () => {
      const response = await request(app)
        .get('/activities')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
    });

    it('deve filtrar atividades por profileId', async () => {
      const response = await request(app)
        .get(`/activities?profileId=${testProfileId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body.every(a => a.profileId === testProfileId)).to.be.true;
    });

    it('deve retornar 401 sem autenticação', async () => {
      await request(app)
        .get('/activities')
        .expect(401);
    });
  });

  describe('GET /activities/:id', () => {
    let activityId;

    beforeEach(() => {
      activityId = uuidv4();
      store.activities.push({
        id: activityId,
        profileId: testProfileId,
        name: 'Terapia ocupacional',
        createdAt: new Date()
      });
    });

    it('deve retornar uma atividade específica', async () => {
      const response = await request(app)
        .get(`/activities/${activityId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.have.property('id', activityId);
      expect(response.body).to.have.property('name', 'Terapia ocupacional');
    });

    it('deve retornar 404 para atividade inexistente', async () => {
      const response = await request(app)
        .get(`/activities/${uuidv4()}`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });

  describe('PUT /activities/:id', () => {
    let activityId;

    beforeEach(() => {
      activityId = uuidv4();
      store.activities.push({
        id: activityId,
        profileId: testProfileId,
        name: 'Terapia ocupacional',
        createdAt: new Date()
      });
    });

    it('deve atualizar uma atividade', async () => {
      const updateData = {
        name: 'Terapia ocupacional avançada',
        durationMinutes: 90
      };

      const response = await request(app)
        .put(`/activities/${activityId}`)
        .set('Authorization', authToken)
        .send(updateData)
        .expect(200);

      expect(response.body.name).to.equal(updateData.name);
    });

    it('deve retornar 404 para atividade inexistente', async () => {
      const response = await request(app)
        .put(`/activities/${uuidv4()}`)
        .set('Authorization', authToken)
        .send({ name: 'Nova atividade' })
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });

  describe('DELETE /activities/:id', () => {
    let activityId;

    beforeEach(() => {
      activityId = uuidv4();
      store.activities.push({
        id: activityId,
        profileId: testProfileId,
        name: 'Terapia ocupacional',
        createdAt: new Date()
      });
    });

    it('deve excluir uma atividade', async () => {
      const response = await request(app)
        .delete(`/activities/${activityId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.have.property('message');
      expect(store.activities.find(a => a.id === activityId)).to.be.undefined;
    });

    it('deve retornar 404 para atividade inexistente', async () => {
      const response = await request(app)
        .delete(`/activities/${uuidv4()}`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });
});
