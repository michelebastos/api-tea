# API de Apoio ao Autismo (TEA)

## Visão Geral

Esta é uma API RESTful desenvolvida para apoiar o acompanhamento de pessoas com Transtorno do Espectro Autista (TEA). A solução oferece recursos para gestão e monitoramento de informações relevantes ao acompanhamento de indivíduos autistas, incluindo:

- **Perfis** - Cadastro e gerenciamento de informações pessoais
- **Rotinas** - Organização e acompanhamento de atividades diárias
- **Preferências Sensoriais** - Registro de sensibilidades e restrições
- **Registros de Crises** - Documentação de episódios e gatilhos
- **Atividades Terapêuticas** - Gestão de intervenções e terapias
- **Comunicação Alternativa** - Suporte a recursos de comunicação aumentativa

A aplicação utiliza armazenamento em memória (sem persistência em banco de dados), sendo adequada para fins educacionais, experimentais e de prototipagem.

## Escopo e Objetivos

### Objetivo Principal

Prover uma API RESTful funcional que demonstre padrões de arquitetura em camadas, autenticação JWT e documentação OpenAPI, servindo como referência técnica e base para evoluções futuras.

### Público-Alvo

- Desenvolvedores de software
- Equipes técnicas em processos de onboarding
- Pesquisadores e estudantes de arquitetura de sistemas
- Profissionais envolvidos em projetos de tecnologia assistiva

### Objetivos Técnicos

- Validar arquitetura REST com separação de responsabilidades
- Demonstrar implementação de autenticação via JSON Web Token (JWT)
- Exemplificar documentação de API através de especificação OpenAPI 3.0
- Fornecer estrutura base para evolução e integração com sistemas de persistência

## Uso de Inteligência Artificial

Este projeto foi desenvolvido com apoio de ferramentas de Inteligência Artificial.

### Propósito do Uso de IA

A utilização de IA teve como objetivos:

- Acelerar a criação da estrutura inicial do projeto
- Aplicar padrões consolidados e boas práticas de mercado
- Reduzir esforço manual em código repetitivo e boilerplate
- Garantir consistência na implementação dos padrões arquiteturais

### Importante

A IA foi utilizada exclusivamente como ferramenta de suporte ao desenvolvimento. Este projeto segue princípios de transparência e conformidade com boas práticas corporativas em relação ao uso de tecnologias de IA no desenvolvimento de software.

## Tecnologias e Ferramentas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **JSON Web Token (JWT)** - Autenticação baseada em token Bearer
- **Swagger / OpenAPI 3.0** - Especificação e documentação da API (formato YAML)
- **bcrypt** - Hashing de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **uuid** - Geração de identificadores únicos
- **express-validator** - Validação de requisições HTTP
- **Armazenamento em memória** - Estruturas de dados JavaScript (arrays/objetos)

## Arquitetura da Solução

A aplicação segue o padrão de arquitetura em camadas, com separação clara de responsabilidades:

### Controllers
Camada responsável pela exposição dos endpoints REST, recebimento de requisições HTTP, delegação de lógica de negócio e formatação de respostas.

### Services
Camada que concentra as regras de negócio, validações de domínio e orquestração de operações entre diferentes repositórios.

### Repositories
Camada de acesso e manipulação dos dados armazenados em memória, abstraindo a fonte de dados do restante da aplicação.

### Middlewares
Componentes transversais responsáveis por autenticação JWT, validação de requisições e tratamento centralizado de erros.

### Validations
Definições de regras de validação de entrada utilizando express-validator.

### Docs
Documentação técnica da API através de especificação OpenAPI (arquivo `swagger.yaml` versionado).

## Estrutura do Projeto

```
src/
├── config/
│   └── env.js
├── data/
│   ├── seedData.js
│   └── store.js
├── repositories/
│   ├── activityRepository.js
│   ├── communicationRepository.js
│   ├── meltdownRepository.js
│   ├── profileRepository.js
│   ├── routineRepository.js
│   ├── sensoryPreferenceRepository.js
│   └── userRepository.js
├── services/
│   ├── activityService.js
│   ├── authService.js
│   ├── communicationService.js
│   ├── meltdownService.js
│   ├── profileService.js
│   ├── routineService.js
│   └── sensoryPreferenceService.js
├── controllers/
│   ├── activityController.js
│   ├── authController.js
│   ├── communicationController.js
│   ├── meltdownController.js
│   ├── profileController.js
│   ├── routineController.js
│   └── sensoryPreferenceController.js
├── routes/
│   ├── activityRoutes.js
│   ├── authRoutes.js
│   ├── communicationRoutes.js
│   ├── meltdownRoutes.js
│   ├── profileRoutes.js
│   ├── routineRoutes.js
│   └── sensoryPreferenceRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── validations/
│   └── validators.js
├── docs/
│   └── swagger.yaml
├── app.js
└── server.js
```

## Instalação

### Pré-requisitos

- Node.js versão 16 ou superior
- npm (Node Package Manager)

### Passos de Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Acessar o diretório do projeto
cd api-tea

# Instalar dependências
npm install

# (Opcional) Configurar variáveis de ambiente
cp .env.example .env
```

## Execução da Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

A aplicação será executada por padrão na **porta 3000**.

**Importante:** Todos os dados armazenados em memória são reinicializados a cada reinicialização do serviço.

## Autenticação e Segurança

A API utiliza autenticação baseada em **JSON Web Token (JWT)** com esquema Bearer.

### Endpoint Público

- `POST /auth/login` - Único endpoint que não requer autenticação

### Credenciais Padrão (Ambiente Local)

```json
{
  "email": "admin@autismo.com",
  "password": "123456"
}
```

### Fluxo de Autenticação

1. Realizar requisição de login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@autismo.com",
  "password": "123456"
}
```

2. Obter token JWT na resposta:

```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. Incluir token no header de requisições protegidas:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Recursos de Segurança

- Senhas armazenadas com hash bcrypt
- Tokens JWT com expiração configurável
- Senhas nunca são retornadas em respostas
- Middleware de autenticação em todos os endpoints protegidos
- Validação de entrada em todas as rotas

## Documentação da API

A API possui documentação interativa através do **Swagger UI**, baseada em especificação OpenAPI 3.0.

### Acesso à Documentação

```
http://localhost:3000/swagger
```

### Arquivo de Especificação

A documentação está definida no arquivo versionado:

```
src/docs/swagger.yaml
```

### Recursos da Documentação

- Consulta de todos os endpoints disponíveis
- Visualização de schemas e estruturas de dados
- Exemplos de requisições e respostas
- Execução de chamadas autenticadas diretamente pela interface
- Descrição detalhada de parâmetros e validações

## Endpoints Principais

### Autenticação
- `POST /auth/login` - Autenticação e geração de token

### Perfis
- `POST /profiles` - Criar perfil
- `GET /profiles` - Listar perfis
- `GET /profiles/:id` - Buscar perfil por ID
- `PUT /profiles/:id` - Atualizar perfil
- `DELETE /profiles/:id` - Excluir perfil

### Rotinas
- `POST /routines` - Criar rotina
- `GET /routines` - Listar rotinas
- `GET /routines/:id` - Buscar rotina por ID
- `PUT /routines/:id` - Atualizar rotina
- `DELETE /routines/:id` - Excluir rotina

### Preferências Sensoriais
- `POST /sensory-preferences` - Criar preferência
- `GET /sensory-preferences` - Listar preferências
- `GET /sensory-preferences/:id` - Buscar preferência por ID
- `PUT /sensory-preferences/:id` - Atualizar preferência
- `DELETE /sensory-preferences/:id` - Excluir preferência

### Crises
- `POST /meltdowns` - Registrar crise
- `GET /meltdowns` - Listar crises
- `GET /meltdowns/:id` - Buscar crise por ID
- `DELETE /meltdowns/:id` - Excluir registro de crise

### Atividades Terapêuticas
- `POST /activities` - Criar atividade
- `GET /activities` - Listar atividades
- `GET /activities/:id` - Buscar atividade por ID
- `PUT /activities/:id` - Atualizar atividade
- `DELETE /activities/:id` - Excluir atividade

### Comunicação Alternativa
- `POST /communication` - Criar registro de comunicação
- `GET /communication` - Listar comunicações
- `GET /communication/:id` - Buscar comunicação por ID
- `PUT /communication/:id` - Atualizar comunicação
- `DELETE /communication/:id` - Excluir comunicação

## Testes Automatizados

A aplicação conta com uma suíte completa de testes automatizados que garantem a qualidade e confiabilidade do código.

### Estrutura de Testes

```
test/
├── setup.js                    # Configuração global dos testes
├── helpers/                    # Utilitários de teste
│   ├── authHelper.js          # Geração de tokens JWT para testes
│   ├── mockRequest.js         # Mock de requisições Express
│   └── mockResponse.js        # Mock de respostas Express
├── unit/                      # Testes unitários
│   └── controllers/           # Testes de controllers isolados
│       ├── auth.controller.spec.js
│       ├── profile.controller.spec.js
│       ├── routine.controller.spec.js
│       └── meltdown.controller.spec.js
└── integration/               # Testes de integração
    ├── auth.rest.spec.js      # Testes REST de autenticação
    ├── profile.rest.spec.js   # Testes REST de perfis
    ├── routine.rest.spec.js   # Testes REST de rotinas
    └── meltdown.rest.spec.js  # Testes REST de crises
```

### Stack de Testes

- **Mocha**: Test runner
- **Chai**: Biblioteca de assertions
- **Sinon**: Mocks, stubs e spies
- **Supertest**: Testes de requisições HTTP
- **NYC (Istanbul)**: Cobertura de código

### Comandos Disponíveis

Executar todos os testes:
```bash
npm test
```

Executar apenas testes unitários:
```bash
npm run test:unit
```

Executar apenas testes de integração:
```bash
npm run test:integration
```

Gerar relatório de cobertura:
```bash
npm run test:coverage
```

### Scripts de Execução

Para contornar problemas de políticas de execução do PowerShell:

**Windows:**
```cmd
run-tests.bat
```

**Linux/Mac:**
```bash
./run-tests.sh
```

### Cobertura de Código

- **Meta mínima**: 80% de cobertura
- **Configuração**: `.nycrc.json`
- **Relatórios**: Gerados em `coverage/`

### Integração Contínua

A suíte de testes é executada automaticamente via GitHub Actions em:
- Pull Requests
- Push para branch main
- Múltiplas versões do Node.js (16, 18, 20)

### Documentação Completa

Para informações detalhadas sobre estratégias de teste, exemplos e boas práticas, consulte:

```
docs/TESTING.md
```

## Limitações Técnicas

### Armazenamento em Memória

- Os dados são armazenados exclusivamente em memória (estruturas JavaScript)
- Não há persistência após reinicialização do serviço
- Todos os dados são perdidos ao encerrar a aplicação

### Restrições de Uso

- **Não recomendado para ambiente de produção**
- Ausência de persistência de dados
- Falta de controle avançado de acesso e permissões
- Limitações de escalabilidade horizontal
- Ausência de auditoria de operações

### Finalidade

Esta implementação é adequada para:
- Ambientes de desenvolvimento e testes
- Prototipagem rápida
- Validação de conceitos arquiteturais
- Demonstrações técnicas

## Possíveis Evoluções

### Persistência de Dados
- Integração com bancos de dados relacionais (PostgreSQL, MySQL)
- Integração com bancos de dados NoSQL (MongoDB)
- Implementação de ORM/ODM (Sequelize, TypeORM, Mongoose)

### Segurança e Controle de Acesso
- Sistema de perfis e permissões (RBAC)
- Autenticação multi-fator
- Rate limiting e proteção contra ataques
- Auditoria completa de operações

### Observabilidade
- Sistema de logging estruturado
- Métricas de performance
- Rastreamento distribuído (tracing)
- Monitoramento de saúde da aplicação

### Integração
- APIs de notificação (email, SMS, push)
- Integração com prontuários eletrônicos
- Exportação de dados e relatórios
- Webhooks para eventos do sistema

### Conformidade
- Adequação à LGPD (Lei Geral de Proteção de Dados)
- Conformidade com requisitos regulatórios de saúde
- Implementação de políticas de retenção de dados
- Criptografia de dados sensíveis

## Variáveis de Ambiente

Configurar arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=sua-chave-secreta-muito-forte-aqui
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## Créditos

### Idealização e Direcionamento

**Michele Silva Cardoso Bastos**

Responsável por:
- Idealização do projeto
- Definição de requisitos funcionais e não funcionais
- Direcionamento arquitetural
- Curadoria e supervisão do uso de Inteligência Artificial no desenvolvimento

## Licença

Este projeto é disponibilizado sob a licença MIT para fins educacionais e experimentais.

---

**Nota:** Este projeto foi desenvolvido com propósito educacional e de prototipagem. Para uso em ambientes corporativos ou produção, é necessário implementar melhorias em segurança, persistência e conformidade regulatória.
