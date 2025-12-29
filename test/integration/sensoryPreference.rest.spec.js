const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../../src/app');
const store = require('../../src/data/store');
const AuthHelper = require('../helpers/authHelper');

describe('SensoryPreference REST API', () => {
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

  describe('POST /sensory-preferences', () => {
    it('deve criar uma nova preferência sensorial', async () => {
      const preferenceData = {
        profileId: testProfileId,
        soundSensitivity: 'alta',
        lightSensitivity: 'média',
        touchSensitivity: 'baixa',
        foodRestrictions: ['lactose', 'glúten']
      };

      const response = await request(app)
        .post('/sensory-preferences')
        .set('Authorization', authToken)
        .send(preferenceData)
        .expect(201);

      expect(response.body).to.have.property('id');
      expect(response.body.soundSensitivity).to.equal(preferenceData.soundSensitivity);
      expect(response.body.lightSensitivity).to.equal(preferenceData.lightSensitivity);
      expect(response.body.profileId).to.equal(testProfileId);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const preferenceData = {
        profileId: testProfileId,
        soundSensitivity: 'alta',
        lightSensitivity: 'média',
        touchSensitivity: 'baixa'
      };

      await request(app)
        .post('/sensory-preferences')
        .send(preferenceData)
        .expect(401);
    });

    it('deve retornar 400 com dados inválidos', async () => {
      const response = await request(app)
        .post('/sensory-preferences')
        .set('Authorization', authToken)
        .send({})
        .expect(400);

      expect(response.body).to.have.property('errors');
    });
  });

  describe('GET /sensory-preferences', () => {
    let pref1Id, pref2Id;

    beforeEach(() => {
      pref1Id = uuidv4();
      pref2Id = uuidv4();
      
      store.sensoryPreferences.push(
        {
          id: pref1Id,
          profileId: testProfileId,
          soundSensitivity: 'alta',
          lightSensitivity: 'média',
          touchSensitivity: 'baixa',
          createdAt: new Date()
        },
        {
          id: pref2Id,
          profileId: testProfileId,
          soundSensitivity: 'média',
          lightSensitivity: 'alta',
          touchSensitivity: 'baixa',
          createdAt: new Date()
        }
      );
    });

    it('deve retornar todas as preferências sensoriais', async () => {
      const response = await request(app)
        .get('/sensory-preferences')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
    });

    it('deve filtrar preferências por profileId', async () => {
      const response = await request(app)
        .get(`/sensory-preferences?profileId=${testProfileId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body.every(p => p.profileId === testProfileId)).to.be.true;
    });

    it('deve retornar 401 sem autenticação', async () => {
      await request(app)
        .get('/sensory-preferences')
        .expect(401);
    });
  });

  describe('GET /sensory-preferences/:id', () => {
    let prefId;

    beforeEach(() => {
      prefId = uuidv4();
      
      store.sensoryPreferences.push({
        id: prefId,
        profileId: testProfileId,
        soundSensitivity: 'alta',
        lightSensitivity: 'média',
        touchSensitivity: 'baixa',
        createdAt: new Date()
      });
    });

    it('deve retornar uma preferência específica', async () => {
      const response = await request(app)
        .get(`/sensory-preferences/${prefId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.have.property('id', prefId);
      expect(response.body).to.have.property('soundSensitivity', 'alta');
    });

    it('deve retornar 404 para preferência inexistente', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .get(`/sensory-preferences/${nonExistentId}`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });

  describe('PUT /sensory-preferences/:id', () => {
    let prefId;

    beforeEach(() => {
      prefId = uuidv4();
      
      store.sensoryPreferences.push({
        id: prefId,
        profileId: testProfileId,
        soundSensitivity: 'alta',
        lightSensitivity: 'média',
        touchSensitivity: 'baixa',
        createdAt: new Date()
      });
    });

    it('deve atualizar uma preferência', async () => {
      const updateData = {
        soundSensitivity: 'média',
        lightSensitivity: 'alta'
      };

      const response = await request(app)
        .put(`/sensory-preferences/${prefId}`)
        .set('Authorization', authToken)
        .send(updateData)
        .expect(200);

      expect(response.body.soundSensitivity).to.equal(updateData.soundSensitivity);
      expect(response.body.lightSensitivity).to.equal(updateData.lightSensitivity);
    });

    it('deve retornar 404 para preferência inexistente', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .put(`/sensory-preferences/${nonExistentId}`)
        .set('Authorization', authToken)
        .send({ soundSensitivity: 'baixa' })
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });

  describe('DELETE /sensory-preferences/:id', () => {
    let prefId;

    beforeEach(() => {
      prefId = uuidv4();
      
      store.sensoryPreferences.push({
        id: prefId,
        profileId: testProfileId,
        soundSensitivity: 'alta',
        lightSensitivity: 'média',
        touchSensitivity: 'baixa',
        createdAt: new Date()
      });
    });

    it('deve excluir uma preferência', async () => {
      const response = await request(app)
        .delete(`/sensory-preferences/${prefId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.have.property('message');
      expect(store.sensoryPreferences.find(p => p.id === prefId)).to.be.undefined;
    });

    it('deve retornar 404 para preferência inexistente', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .delete(`/sensory-preferences/${nonExistentId}`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });
});
