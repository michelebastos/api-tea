const { expect } = require('chai');
const sinon = require('sinon');
const sensoryPreferenceController = require('../../../src/controllers/sensoryPreferenceController');
const sensoryPreferenceService = require('../../../src/services/sensoryPreferenceService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('SensoryPreference Controller - Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('deve criar uma preferência sensorial com sucesso', async () => {
      const preferenceData = {
        profileId: 'profile-1',
        category: 'auditiva',
        stimulus: 'Música alta',
        sensitivity: 'hipersensibilidade',
        reaction: 'Desconforto e ansiedade'
      };

      const createdPreference = {
        id: 'pref-1',
        ...preferenceData,
        createdAt: new Date()
      };

      const req = mockRequest({ body: preferenceData });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(sensoryPreferenceService, 'create').returns(createdPreference);

      await sensoryPreferenceController.create(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdPreference)).to.be.true;
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando create falha', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new Error('Erro ao criar preferência');

      sinon.stub(sensoryPreferenceService, 'create').throws(error);

      await sensoryPreferenceController.create(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('getAll', () => {
    it('deve retornar todas as preferências sensoriais', async () => {
      const preferences = [
        { id: 'pref-1', category: 'auditiva', stimulus: 'Música alta', profileId: 'profile-1' },
        { id: 'pref-2', category: 'visual', stimulus: 'Luzes fortes', profileId: 'profile-1' }
      ];

      const req = mockRequest({ query: {} });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(sensoryPreferenceService, 'getAll').returns(preferences);

      await sensoryPreferenceController.getAll(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(preferences)).to.be.true;
    });

    it('deve filtrar preferências por profileId', async () => {
      const profileId = 'profile-1';
      const preferences = [
        { id: 'pref-1', category: 'auditiva', stimulus: 'Música alta', profileId }
      ];

      const req = mockRequest({ query: { profileId } });
      const res = mockResponse();
      const next = sinon.spy();

      const serviceStub = sinon.stub(sensoryPreferenceService, 'getAll').returns(preferences);

      await sensoryPreferenceController.getAll(req, res, next);

      expect(serviceStub.calledWith({ profileId })).to.be.true;
      expect(res.json.calledWith(preferences)).to.be.true;
    });
  });

  describe('getById', () => {
    it('deve retornar uma preferência por ID', async () => {
      const preference = {
        id: 'pref-1',
        category: 'auditiva',
        stimulus: 'Música alta',
        profileId: 'profile-1'
      };

      const req = mockRequest({ params: { id: 'pref-1' } });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(sensoryPreferenceService, 'getById').returns(preference);

      await sensoryPreferenceController.getById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(preference)).to.be.true;
    });

    it('deve chamar next com erro quando preferência não existe', async () => {
      const req = mockRequest({ params: { id: 'invalid-id' } });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new Error('Preferência não encontrada');

      sinon.stub(sensoryPreferenceService, 'getById').throws(error);

      await sensoryPreferenceController.getById(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('update', () => {
    it('deve atualizar uma preferência', async () => {
      const updateData = { stimulus: 'Música muito alta' };
      const updatedPreference = {
        id: 'pref-1',
        category: 'auditiva',
        stimulus: 'Música muito alta',
        profileId: 'profile-1'
      };

      const req = mockRequest({
        params: { id: 'pref-1' },
        body: updateData
      });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(sensoryPreferenceService, 'update').returns(updatedPreference);

      await sensoryPreferenceController.update(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedPreference)).to.be.true;
    });
  });

  describe('delete', () => {
    it('deve excluir uma preferência', async () => {
      const result = { message: 'Preferência sensorial excluída com sucesso' };

      const req = mockRequest({ params: { id: 'pref-1' } });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(sensoryPreferenceService, 'delete').returns(result);

      await sensoryPreferenceController.delete(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(result)).to.be.true;
    });
  });
});
