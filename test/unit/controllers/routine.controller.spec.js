const { expect } = require('chai');
const sinon = require('sinon');
const routineController = require('../../../src/controllers/routineController');
const routineService = require('../../../src/services/routineService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('RoutineController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /routines', () => {
    it('deve retornar status 201 e rotina criada', async () => {
      const req = mockRequest({
        body: {
          profileId: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Escovar os dentes',
          time: '08:00'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const createdRoutine = {
        id: 'routine-id',
        profileId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Escovar os dentes',
        time: '08:00',
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      sinon.stub(routineService, 'create').returns(createdRoutine);

      await routineController.create(req, res, next);

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.deep.equal(createdRoutine);
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando profileId inválido', async () => {
      const req = mockRequest({
        body: {
          profileId: 'invalid-id',
          title: 'Escovar os dentes'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const error = new Error('Perfil não encontrado');
      sinon.stub(routineService, 'create').throws(error);

      await routineController.create(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('GET /routines', () => {
    it('deve retornar lista de rotinas sem filtro', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      const next = sinon.spy();

      const routines = [
        { id: '1', title: 'Rotina 1' },
        { id: '2', title: 'Rotina 2' }
      ];

      sinon.stub(routineService, 'getAll').returns(routines);

      await routineController.getAll(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(routines);
    });

    it('deve filtrar rotinas por profileId', async () => {
      const profileId = '123e4567-e89b-12d3-a456-426614174000';
      const req = mockRequest({ query: { profileId } });
      const res = mockResponse();
      const next = sinon.spy();

      const routines = [{ id: '1', profileId, title: 'Rotina 1' }];
      const serviceStub = sinon.stub(routineService, 'getAll').returns(routines);

      await routineController.getAll(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(serviceStub.calledWith({ profileId })).to.be.true;
    });
  });

  describe('GET /routines/:id', () => {
    it('deve retornar rotina quando ID existe', async () => {
      const req = mockRequest({
        params: { id: 'routine-id' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const routine = { id: 'routine-id', title: 'Escovar os dentes' };
      sinon.stub(routineService, 'getById').returns(routine);

      await routineController.getById(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(routine);
    });
  });

  describe('PUT /routines/:id', () => {
    it('deve retornar rotina atualizada', async () => {
      const req = mockRequest({
        params: { id: 'routine-id' },
        body: { title: 'Título Atualizado' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const updatedRoutine = { id: 'routine-id', title: 'Título Atualizado' };
      sinon.stub(routineService, 'update').returns(updatedRoutine);

      await routineController.update(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(updatedRoutine);
    });
  });

  describe('DELETE /routines/:id', () => {
    it('deve retornar mensagem de sucesso', async () => {
      const req = mockRequest({
        params: { id: 'routine-id' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const result = { message: 'Rotina excluída com sucesso' };
      sinon.stub(routineService, 'delete').returns(result);

      await routineController.delete(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(result);
    });
  });
});
