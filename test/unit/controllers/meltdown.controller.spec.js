const { expect } = require('chai');
const sinon = require('sinon');
const meltdownController = require('../../../src/controllers/meltdownController');
const meltdownService = require('../../../src/services/meltdownService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('MeltdownController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /meltdowns', () => {
    it('deve retornar status 201 e registro de crise criado', async () => {
      const req = mockRequest({
        body: {
          profileId: '123e4567-e89b-12d3-a456-426614174000',
          trigger: 'barulho alto',
          intensity: 4,
          occurredAt: '2024-01-01T10:00:00.000Z'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const createdMeltdown = {
        id: 'meltdown-id',
        profileId: '123e4567-e89b-12d3-a456-426614174000',
        trigger: 'barulho alto',
        intensity: 4,
        occurredAt: '2024-01-01T10:00:00.000Z',
        createdAt: '2024-01-01T10:00:00.000Z'
      };

      sinon.stub(meltdownService, 'create').returns(createdMeltdown);

      await meltdownController.create(req, res, next);

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.deep.equal(createdMeltdown);
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando intensidade inválida', async () => {
      const req = mockRequest({
        body: {
          profileId: '123e4567-e89b-12d3-a456-426614174000',
          trigger: 'barulho alto',
          intensity: 6,
          occurredAt: '2024-01-01T10:00:00.000Z'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const error = new Error('Intensidade deve estar entre 1 e 5');
      sinon.stub(meltdownService, 'create').throws(error);

      await meltdownController.create(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('GET /meltdowns', () => {
    it('deve retornar lista de crises com filtros aplicados', async () => {
      const req = mockRequest({
        query: {
          profileId: '123e4567-e89b-12d3-a456-426614174000',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const meltdowns = [
        { id: '1', trigger: 'barulho', intensity: 3 },
        { id: '2', trigger: 'mudança de rotina', intensity: 4 }
      ];

      const serviceStub = sinon.stub(meltdownService, 'getAll').returns(meltdowns);

      await meltdownController.getAll(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(meltdowns);
      expect(serviceStub.calledWith({
        profileId: '123e4567-e89b-12d3-a456-426614174000',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      })).to.be.true;
    });
  });

  describe('GET /meltdowns/:id', () => {
    it('deve retornar crise quando ID existe', async () => {
      const req = mockRequest({
        params: { id: 'meltdown-id' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const meltdown = { id: 'meltdown-id', trigger: 'barulho alto', intensity: 4 };
      sinon.stub(meltdownService, 'getById').returns(meltdown);

      await meltdownController.getById(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(meltdown);
    });
  });

  describe('DELETE /meltdowns/:id', () => {
    it('deve retornar mensagem de sucesso', async () => {
      const req = mockRequest({
        params: { id: 'meltdown-id' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const result = { message: 'Registro de crise excluído com sucesso' };
      sinon.stub(meltdownService, 'delete').returns(result);

      await meltdownController.delete(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(result);
    });
  });
});
