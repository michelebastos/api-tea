const sinon = require('sinon');

/**
 * Mock de objeto Response do Express
 * Utilizado em testes unitários de controllers
 */
const mockResponse = () => {
  const res = {};
  
  res.status = sinon.stub().returnsThis();
  res.json = sinon.stub().returnsThis();
  res.send = sinon.stub().returnsThis();
  
  return res;
};

module.exports = mockResponse;
