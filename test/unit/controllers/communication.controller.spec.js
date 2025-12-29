const { expect } = require('chai');
const sinon = require('sinon');
const communicationController = require('../../../src/controllers/communicationController');
const communicationService = require('../../../src/services/communicationService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('Communication Controller - Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('deve criar um registro de comunicação com sucesso', async () => {
      const communicationData = {
        profileId: 'profile-1',
        category: 'necessidades',
        symbol: 'agua.png',
        label: 'Água',
        description: 'Quero beber água'
      };

      const createdCommunication = {
        id: 'comm-1',
        ...communicationData,
        createdAt: new Date()
      };

      const req = mockRequest({ body: communicationData });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(communicationService, 'create').returns(createdCommunication);

      await communicationController.create(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdCommunication)).to.be.true;
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando create falha', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new Error('Erro ao criar comunicação');

      sinon.stub(communicationService, 'create').throws(error);

      await communicationController.create(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('getAll', () => {
    it('deve retornar todas as comunicações', async () => {
      const communications = [
        { id: 'comm-1', label: 'Água', category: 'necessidades', profileId: 'profile-1' },
        { id: 'comm-2', label: 'Comida', category: 'necessidades', profileId: 'profile-1' }
      ];

      const req = mockRequest({ query: {} });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(communicationService, 'getAll').returns(communications);

      await communicationController.getAll(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(communications)).to.be.true;
    });

    it('deve filtrar comunicações por profileId e categoria', async () => {
      const profileId = 'profile-1';
      const category = 'necessidades';
      const communications = [
        { id: 'comm-1', label: 'Água', category, profileId }
      ];

      const req = mockRequest({ query: { profileId, category } });
      const res = mockResponse();
      const next = sinon.spy();

      const serviceStub = sinon.stub(communicationService, 'getAll').returns(communications);

      await communicationController.getAll(req, res, next);

      expect(serviceStub.calledWith({ profileId, category })).to.be.true;
      expect(res.json.calledWith(communications)).to.be.true;
    });
  });

  describe('getById', () => {
    it('deve retornar uma comunicação por ID', async () => {
      const communication = {
        id: 'comm-1',
        label: 'Água',
        category: 'necessidades',
        profileId: 'profile-1'
      };

      const req = mockRequest({ params: { id: 'comm-1' } });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(communicationService, 'getById').returns(communication);

      await communicationController.getById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(communication)).to.be.true;
    });

    it('deve chamar next com erro quando comunicação não existe', async () => {
      const req = mockRequest({ params: { id: 'invalid-id' } });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new Error('Comunicação não encontrada');

      sinon.stub(communicationService, 'getById').throws(error);

      await communicationController.getById(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('update', () => {
    it('deve atualizar uma comunicação', async () => {
      const updateData = { label: 'Água gelada' };
      const updatedCommunication = {
        id: 'comm-1',
        label: 'Água gelada',
        category: 'necessidades',
        profileId: 'profile-1'
      };

      const req = mockRequest({
        params: { id: 'comm-1' },
        body: updateData
      });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(communicationService, 'update').returns(updatedCommunication);

      await communicationController.update(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedCommunication)).to.be.true;
    });
  });

  describe('delete', () => {
    it('deve excluir uma comunicação', async () => {
      const result = { message: 'Comunicação excluída com sucesso' };

      const req = mockRequest({ params: { id: 'comm-1' } });
      const res = mockResponse();
      const next = sinon.spy();

      sinon.stub(communicationService, 'delete').returns(result);

      await communicationController.delete(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(result)).to.be.true;
    });
  });
});
