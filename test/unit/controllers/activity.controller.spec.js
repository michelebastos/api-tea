const { expect } = require('chai');
const sinon = require('sinon');
const activityController = require('../../../src/controllers/activityController');
const activityService = require('../../../src/services/activityService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('Activity Controller - Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('deve criar uma atividade com sucesso', async () => {
      const activityData = {
        profileId: 'profile-1',
        name: 'Terapia ocupacional',
        type: 'ocupacional',
        description: 'Sessão de terapia'
      };

      const createdActivity = {
        id: 'activity-1',
        ...activityData,
        createdAt: new Date()
      };

      const req = mockRequest({ body: activityData });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(activityService, 'create').returns(createdActivity);

      await activityController.create(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdActivity)).to.be.true;
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando create falha', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new Error('Erro ao criar atividade');

      sinon.stub(activityService, 'create').throws(error);

      await activityController.create(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('getAll', () => {
    it('deve retornar todas as atividades', async () => {
      const activities = [
        { id: 'activity-1', name: 'Terapia 1', profileId: 'profile-1' },
        { id: 'activity-2', name: 'Terapia 2', profileId: 'profile-1' }
      ];

      const req = mockRequest({ query: {} });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(activityService, 'getAll').returns(activities);

      await activityController.getAll(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(activities)).to.be.true;
    });

    it('deve filtrar atividades por profileId', async () => {
      const profileId = 'profile-1';
      const activities = [
        { id: 'activity-1', name: 'Terapia 1', profileId }
      ];

      const req = mockRequest({ query: { profileId } });
      const res = mockResponse();
      const next = sinon.spy();

      const serviceStub = sinon.stub(activityService, 'getAll').returns(activities);

      await activityController.getAll(req, res, next);

      expect(serviceStub.calledWith({ profileId })).to.be.true;
      expect(res.json.calledWith(activities)).to.be.true;
    });
  });

  describe('getById', () => {
    it('deve retornar uma atividade por ID', async () => {
      const activity = {
        id: 'activity-1',
        name: 'Terapia ocupacional',
        profileId: 'profile-1'
      };

      const req = mockRequest({ params: { id: 'activity-1' } });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(activityService, 'getById').returns(activity);

      await activityController.getById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(activity)).to.be.true;
    });

    it('deve chamar next com erro quando atividade não existe', async () => {
      const req = mockRequest({ params: { id: 'invalid-id' } });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new Error('Atividade não encontrada');

      sinon.stub(activityService, 'getById').throws(error);

      await activityController.getById(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('update', () => {
    it('deve atualizar uma atividade', async () => {
      const updateData = { name: 'Terapia atualizada' };
      const updatedActivity = {
        id: 'activity-1',
        name: 'Terapia atualizada',
        profileId: 'profile-1'
      };

      const req = mockRequest({
        params: { id: 'activity-1' },
        body: updateData
      });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(activityService, 'update').returns(updatedActivity);

      await activityController.update(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedActivity)).to.be.true;
    });
  });

  describe('delete', () => {
    it('deve excluir uma atividade', async () => {
      const result = { message: 'Atividade excluída com sucesso' };

      const req = mockRequest({ params: { id: 'activity-1' } });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(activityService, 'delete').returns(result);

      await activityController.delete(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(result)).to.be.true;
    });
  });
});
