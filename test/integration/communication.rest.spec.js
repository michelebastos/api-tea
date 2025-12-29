const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../../src/app');
const store = require('../../src/data/store');
const AuthHelper = require('../helpers/authHelper');

describe('Communication REST API', () => {
  let authToken;
  let testProfileId;

  beforeEach(() => {
    store.reset();
    authToken = AuthHelper.generateTestToken();
    testProfileId = uuidv4();
    store.profiles.push({
      id: testProfileId,
      name: 'João',
      userId: uuidv4()
    });
  });

  it('deve criar e buscar comunicação', async () => {
    const data = {
      profileId: testProfileId,
      phrase: 'Quero água',
      meaning: 'Necessidade de beber',
      category: 'necessidade'
    };

    const res = await request(app)
      .post('/communication')
      .set('Authorization', authToken)
      .send(data)
      .expect(201);

    expect(res.body).to.have.property('id');

    const getRes = await request(app)
      .get('/communication')
      .set('Authorization', authToken)
      .expect(200);

    expect(getRes.body).to.have.lengthOf(1);
  });
});
