const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../../src/app');
const store = require('../../src/data/store');
const AuthHelper = require('../helpers/authHelper');

describe('Communication REST API - Integration Tests', () => {
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

  describe('POST /communication', () => {
    it('deve criar um novo registro de comunicação', async () => {
      const communicationData = {
        profileId: testProfileId,
        category: 'necessidade',
        phrase: 'Água',
        meaning: 'Quero beber água'
      };

      const response = await request(app)
        .post('/communication')
        .set('Authorization', authToken)
        .send(communicationData)
        .expect(201);

      expect(response.body).to.have.property('id');
      expect(response.body.category).to.equal(communicationData.category);
      expect(response.body.phrase).to.equal(communicationData.phrase);
      expect(response.body.profileId).to.equal(testProfileId);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const communicationData = {
        profileId: testProfileId,
        category: 'necessidade',
        phrase: 'Água',
        meaning: 'Quero água'
      };

      await request(app)
        .post('/communication')
        .send(communicationData)
        .expect(401);
    });

    it('deve retornar 400 com dados inválidos', async () => {
      const response = await request(app)
        .post('/communication')
        .set('Authorization', authToken)
        .send({})
        .expect(400);

      expect(response.body).to.have.property('errors');
    });
  });

  describe('GET /communication', () => {
    let comm1Id, comm2Id;

    beforeEach(() => {
      comm1Id = uuidv4();
      comm2Id = uuidv4();
      
      store.communication.push(
        {
          id: comm1Id,
          profileId: testProfileId,
          category: 'necessidade',
          phrase: 'Água',
          meaning: 'Quero água',
          createdAt: new Date()
        },
        {
          id: comm2Id,
          profileId: testProfileId,
          category: 'emoção',
          phrase: 'Feliz',
          meaning: 'Estou feliz',
          createdAt: new Date()
        }
      );
    });

    it('deve retornar todas as comunicações', async () => {
      const response = await request(app)
        .get('/communication')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
    });

    it('deve filtrar comunicações por profileId', async () => {
      const response = await request(app)
        .get(`/communication?profileId=${testProfileId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body.every(c => c.profileId === testProfileId)).to.be.true;
    });

    it('deve filtrar comunicações por categoria', async () => {
      const response = await request(app)
        .get('/communication?category=necessidade')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body.every(c => c.category === 'necessidade')).to.be.true;
    });

    it('deve retornar 401 sem autenticação', async () => {
      await request(app)
        .get('/communication')
        .expect(401);
    });
  });

  describe('GET /communication/:id', () => {
    let commId;

    beforeEach(() => {
      commId = uuidv4();
      
      store.communication.push({
        id: commId,
        profileId: testProfileId,
        category: 'necessidade',
        phrase: 'Água',
        meaning: 'Quero água',
        createdAt: new Date()
      });
    });

    it('deve retornar uma comunicação específica', async () => {
      const response = await request(app)
        .get(`/communication/${commId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.have.property('id', commId);
      expect(response.body).to.have.property('phrase', 'Água');
    });

    it('deve retornar 404 para comunicação inexistente', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .get(`/communication/${nonExistentId}`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });

  describe('PUT /communication/:id', () => {
    let commId;

    beforeEach(() => {
      commId = uuidv4();
      
      store.communication.push({
        id: commId,
        profileId: testProfileId,
        category: 'necessidade',
        phrase: 'Água',
        meaning: 'Quero água',
        createdAt: new Date()
      });
    });

    it('deve atualizar uma comunicação', async () => {
      const updateData = {
        phrase: 'Água gelada',
        meaning: 'Quero água bem gelada'
      };

      const response = await request(app)
        .put(`/communication/${commId}`)
        .set('Authorization', authToken)
        .send(updateData)
        .expect(200);

      expect(response.body.phrase).to.equal(updateData.phrase);
      expect(response.body.meaning).to.equal(updateData.meaning);
    });

    it('deve retornar 404 para comunicação inexistente', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .put(`/communication/${nonExistentId}`)
        .set('Authorization', authToken)
        .send({ phrase: 'Nova comunicação', meaning: 'Novo significado' })
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });

  describe('DELETE /communication/:id', () => {
    let commId;

    beforeEach(() => {
      commId = uuidv4();
      
      store.communication.push({
        id: commId,
        profileId: testProfileId,
        category: 'necessidade',
        phrase: 'Água',
        meaning: 'Quero água',
        createdAt: new Date()
      });
    });

    it('deve excluir uma comunicação', async () => {
      const response = await request(app)
        .delete(`/communication/${commId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).to.have.property('message');
      expect(store.communication.find(c => c.id === commId)).to.be.undefined;
    });

    it('deve retornar 404 para comunicação inexistente', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .delete(`/communication/${nonExistentId}`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body).to.have.property('message');
    });
  });
});
