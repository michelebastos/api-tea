/**
 * Mock de objeto Response do Express
 * Utilizado em testes unitários de controllers
 */
const mockResponse = () => {
  const res = {};
  
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  
  res.json = function(data) {
    this.body = data;
    return this;
  };
  
  res.send = function(data) {
    this.body = data;
    return this;
  };
  
  res.statusCode = 200;
  res.body = null;
  
  return res;
};

module.exports = mockResponse;
