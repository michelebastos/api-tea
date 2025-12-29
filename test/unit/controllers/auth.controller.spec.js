const { expect } = require('chai');
const sinon = require('sinon');
const authController = require('../../../src/controllers/authController');
const authService = require('../../../src/services/authService');
const mockRequest = require('../../helpers/mockRequest');
const mockResponse = require('../../helpers/mockResponse');

describe('AuthController', () => {
  describe('POST /auth/login', () => {
    let authServiceStub;

    afterEach(() => {
      if (authServiceStub) {
        authServiceStub.restore();
      }
    });

    it('deve retornar status 200 e token quando credenciais válidas', async () => {
      const req = mockRequest({
        body: {
          email: 'admin@autismo.com',
          password: '123456'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const expectedToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      authServiceStub = sinon.stub(authService, 'login').resolves({ token: expectedToken });

      await authController.login(req, res, next);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ token: expectedToken });
      expect(authServiceStub.calledOnce).to.be.true;
      expect(authServiceStub.calledWith('admin@autismo.com', '123456')).to.be.true;
      expect(next.called).to.be.false;
    });

    it('deve chamar next com erro quando credenciais inválidas', async () => {
      const req = mockRequest({
        body: {
          email: 'invalido@email.com',
          password: 'senhaerrada'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const error = new Error('Credenciais inválidas');
      authServiceStub = sinon.stub(authService, 'login').rejects(error);

      await authController.login(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
      expect(res.statusCode).to.equal(200); // Não alterado pois erro foi passado para next
    });

    it('deve chamar next com erro quando service lança exceção', async () => {
      const req = mockRequest({
        body: {
          email: 'admin@autismo.com',
          password: '123456'
        }
      });
      const res = mockResponse();
      const next = sinon.spy();

      const error = new Error('Erro interno do servidor');
      authServiceStub = sinon.stub(authService, 'login').rejects(error);

      await authController.login(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });
});
