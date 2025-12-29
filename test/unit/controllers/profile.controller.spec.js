const { expect } = require('chai');
const sinon = require('sinon');
const profileController = require('../../../src/controllers/profileController');
const profileService = require('../../../src/services/profileService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('ProfileController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /profiles', () => {
    it('deve retornar status 201 e perfil criado quando dados válidos', async () => {
      const req = mockRequest({
        body: {
          name: 'João Silva',
          age: 12,
          supportLevel: 'moderado'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const createdProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        age: 12,
        supportLevel: 'moderado',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      const serviceStub = sinon.stub(profileService, 'create').returns(createdProfile);

      await profileController.create(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdProfile)).to.be.true;
      expect(serviceStub.calledOnce).to.be.true;
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando service lança exceção', async () => {
      const req = mockRequest({
        body: {
          name: 'João Silva',
          age: 12,
          supportLevel: 'moderado'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const error = new Error('Erro ao criar perfil');
      sinon.stub(profileService, 'create').throws(error);

      await profileController.create(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('GET /profiles', () => {
    it('deve retornar status 200 e lista de perfis', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();

      const profiles = [
        { id: '1', name: 'Perfil 1', age: 10, supportLevel: 'leve' },
        { id: '2', name: 'Perfil 2', age: 15, supportLevel: 'moderado' }
      ];

      sinon.stub(profileService, 'getAll').returns(profiles);

      await profileController.getAll(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(profiles)).to.be.true;
      expect(next.called).to.be.false;
    });
  });

  describe('GET /profiles/:id', () => {
    it('deve retornar status 200 e perfil quando ID existe', async () => {
      const req = mockRequest({
        params: { id: '123e4567-e89b-12d3-a456-426614174000' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const profile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        age: 12,
        supportLevel: 'moderado'
      };

      sinon.stub(profileService, 'getById').returns(profile);

      await profileController.getById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(profile)).to.be.true;
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando perfil não existe', async () => {
      const req = mockRequest({
        params: { id: 'id-inexistente' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const error = new Error('Perfil não encontrado');
      sinon.stub(profileService, 'getById').throws(error);

      await profileController.getById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('PUT /profiles/:id', () => {
    it('deve retornar status 200 e perfil atualizado', async () => {
      const req = mockRequest({
        params: { id: '123e4567-e89b-12d3-a456-426614174000' },
        body: { name: 'João Silva Atualizado' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const updatedProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva Atualizado',
        age: 12,
        supportLevel: 'moderado'
      };

      sinon.stub(profileService, 'update').returns(updatedProfile);

      await profileController.update(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedProfile)).to.be.true;
      expect(next.called).to.be.false;
    });
  });

  describe('DELETE /profiles/:id', () => {
    it('deve retornar status 200 e mensagem de sucesso', async () => {
      const req = mockRequest({
        params: { id: '123e4567-e89b-12d3-a456-426614174000' }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const result = { message: 'Perfil excluído com sucesso' };
      sinon.stub(profileService, 'delete').returns(result);

      await profileController.delete(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(result)).to.be.true;
      expect(next.called).to.be.false;
    });
  });
});
