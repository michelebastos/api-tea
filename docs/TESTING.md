# Testes Automatizados

## Visão Geral

Este projeto implementa uma estratégia completa de testes automatizados seguindo padrões corporativos de qualidade de software.

## Stack de Testes

- **Mocha** - Test runner
- **Chai** - Biblioteca de assertions (expect)
- **Sinon** - Mocks, stubs e spies para testes unitários
- **Supertest** - Testes de integração HTTP
- **nyc (Istanbul)** - Análise de cobertura de código

## Estrutura de Testes

```
test/
├── unit/
│   └── controllers/
│       ├── auth.controller.spec.js
│       ├── profile.controller.spec.js
│       ├── routine.controller.spec.js
│       └── meltdown.controller.spec.js
├── integration/
│   ├── auth.rest.spec.js
│   ├── profile.rest.spec.js
│   ├── routine.rest.spec.js
│   └── meltdown.rest.spec.js
├── helpers/
│   ├── mockRequest.js
│   ├── mockResponse.js
│   └── authHelper.js
└── setup.js
```

## Tipos de Testes

### Testes Unitários (Controllers)

Validam o comportamento dos controllers isoladamente, sem subir o servidor:

- **Objetivo:** Testar a lógica do controller
- **Tecnologia:** Sinon para mocks e stubs
- **Foco:** Status codes, payloads, tratamento de erros
- **Isolamento:** Services são completamente mockados

**Exemplo:**
```javascript
it('deve retornar status 200 e token quando credenciais válidas', async () => {
  const req = mockRequest({ body: { email, password } });
  const res = mockResponse();
  
  authServiceStub = sinon.stub(authService, 'login').resolves({ token });
  
  await authController.login(req, res, next);
  
  expect(res.statusCode).to.equal(200);
  expect(res.body).to.deep.equal({ token });
});
```

### Testes de Integração (REST)

Validam o fluxo completo da API com todas as camadas integradas:

- **Objetivo:** Testar o comportamento real da API
- **Tecnologia:** Supertest
- **Foco:** Contratos HTTP, autenticação, validações
- **Integração:** Controllers + Services + Repositories

**Exemplo:**
```javascript
it('deve criar perfil com dados válidos e retornar 201', (done) => {
  request(app)
    .post('/profiles')
    .set('Authorization', authHelper.getAuthHeader())
    .send({ name: 'João Silva', age: 12, supportLevel: 'moderado' })
    .expect(201)
    .end((err, res) => {
      expect(res.body).to.have.property('id');
      done();
    });
});
```

## Scripts Disponíveis

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## Instalação das Dependências

```bash
npm install --save-dev mocha chai sinon supertest nyc
```

## Executando os Testes

### Primeira execução

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm test
```

### Relatório de Cobertura

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Visualizar relatório HTML
open coverage/index.html
```

## Configuração de Cobertura

Arquivo `.nycrc.json` define:
- Cobertura mínima exigida: 80%
- Formatos de relatório: text, lcov, html
- Arquivos excluídos da análise

## Pipeline CI/CD

O projeto inclui configuração GitHub Actions (`.github/workflows/ci.yml`) que:

1. Instala dependências
2. Executa testes unitários
3. Executa testes de integração
4. Gera relatório de cobertura
5. Verifica cobertura mínima (80%)
6. Publica artefatos de cobertura

O pipeline **falhará** se:
- Qualquer teste falhar
- Cobertura ficar abaixo de 80%

## Boas Práticas Implementadas

### Testes Unitários
- ✅ Isolamento completo com Sinon stubs
- ✅ Um arquivo por controller
- ✅ Limpeza de stubs com `afterEach`
- ✅ Nomes descritivos e claros
- ✅ Foco no comportamento observável

### Testes de Integração
- ✅ Autenticação real via AuthHelper
- ✅ Testes independentes e determinísticos
- ✅ Validação de contratos HTTP
- ✅ Cobertura de casos de sucesso e erro
- ✅ Testes de autenticação e autorização

### Helpers
- ✅ `mockRequest` - Mock de requisições Express
- ✅ `mockResponse` - Mock de respostas Express
- ✅ `authHelper` - Geração de tokens JWT reais

## Cobertura de Testes

Os testes cobrem:

- ✅ Autenticação (login válido/inválido)
- ✅ CRUD de Perfis
- ✅ CRUD de Rotinas
- ✅ CRUD de Crises (Meltdowns)
- ✅ Validações de entrada
- ✅ Tratamento de erros
- ✅ Autenticação JWT
- ✅ Casos de sucesso e falha

## Estrutura de um Teste

### Teste Unitário

```javascript
describe('Controller', () => {
  describe('Método HTTP /endpoint', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('deve retornar sucesso quando dados válidos', async () => {
      // Arrange
      const req = mockRequest({ body: { ... } });
      const res = mockResponse();
      const stub = sinon.stub(service, 'method').returns(data);

      // Act
      await controller.method(req, res, next);

      // Assert
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(expected);
    });
  });
});
```

### Teste de Integração

```javascript
describe('REST API - Resource', () => {
  let authHelper;

  before(async () => {
    await initializeDefaultUser();
    authHelper = new AuthHelper();
    await authHelper.authenticate();
  });

  it('deve retornar sucesso quando autenticado', (done) => {
    request(app)
      .post('/endpoint')
      .set('Authorization', authHelper.getAuthHeader())
      .send({ ... })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        done();
      });
  });
});
```

## Troubleshooting

### Testes Falhando

```bash
# Verificar detalhes dos erros
npm test -- --reporter spec

# Executar teste específico
npx mocha test/unit/controllers/auth.controller.spec.js
```

### Problemas de Timeout

Ajustar timeout em `.mocharc.json`:
```json
{
  "timeout": 10000
}
```

### Stubs Não Restaurados

Sempre usar `afterEach` para limpar stubs:
```javascript
afterEach(() => {
  sinon.restore();
});
```

## Próximos Passos

- [ ] Adicionar testes para Activities
- [ ] Adicionar testes para Communication
- [ ] Adicionar testes para Sensory Preferences
- [ ] Implementar testes de performance
- [ ] Adicionar testes de contrato (Pact)
- [ ] Integrar com SonarQube para análise de qualidade

## Recursos Adicionais

- [Documentação Mocha](https://mochajs.org/)
- [Documentação Chai](https://www.chaijs.com/)
- [Documentação Sinon](https://sinonjs.org/)
- [Documentação Supertest](https://github.com/visionmedia/supertest)
- [Documentação NYC](https://github.com/istanbuljs/nyc)
