const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../../src/app');
const store = require('../../src/data/store');
const AuthHelper = require('../helpers/authHelper');

describe('Activity REST API', () => {
  let authToken;
  let testProfileId;

  beforeEach(() => {
    store.reset();
    authToken = AuthHelper.generateTestToken();
    testProfileId = uuidv4();
    store.profiles.push({
      id: testProfileId,
      name: 'João',
      dateOfBirth: '2010-05-15',
      userId: uuidv4()
    });
  });

  it('deve criar e listar atividades', async () => {
    const activityData = {
      profileId: testProfileId,
      name: 'Terapia ocupacional',
      durationMinutes: 60
    };

    const createResponse = await request(app)
      .post('/activities')
      .set('Authorization', authToken)
      .send(activityData)
      .expect(201);

    expect(createResponse.body).to.have.property('id');
    expect(createResponse.body.name).to.equal(activityData.name);

    const listResponse = await request(app)
      .get('/activities')
      .set('Authorization', authToken)
      .expect(200);

    expect(listResponse.body).to.be.an('array');
    expect(listResponse.body).to.have.lengthOf(1);
  });

  it('deve atualizar e excluir atividade', async () => {
    const activityId = uuidv4();
    store.activities.push({
      id: activityId,
      profileId: testProfileId,
      name: 'Terapia',
      createdAt: new Date()
    });

    await request(app)
      .put(`/activities/${activityId}`)
      .set('Authorization', authToken)
      .send({ name: 'Terapia atualizada' })
      .expect(200);

    await request(app)
      .delete(`/activities/${activityId}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(store.activities.find(a => a.id === activityId)).to.be.undefined;
  });
});
