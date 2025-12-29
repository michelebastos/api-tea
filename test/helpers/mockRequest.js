/**
 * Mock de objeto Request do Express
 * Utilizado em testes unitários de controllers
 */
const mockRequest = (options = {}) => {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    user: options.user || null,
    method: options.method || 'GET',
    url: options.url || '/',
    get: function(header) {
      return this.headers[header.toLowerCase()];
    }
  };
};

module.exports = mockRequest;
