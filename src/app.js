const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const routineRoutes = require('./routes/routineRoutes');
const sensoryPreferenceRoutes = require('./routes/sensoryPreferenceRoutes');
const meltdownRoutes = require('./routes/meltdownRoutes');
const activityRoutes = require('./routes/activityRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de saúde
app.get('/', (req, res) => {
  res.json({
    message: '💙 API de Apoio ao Autismo',
    version: '1.0.0',
    status: 'online',
    docs: '/swagger'
  });
});

// Swagger Documentation
const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(__dirname, 'docs', 'swagger.yaml'), 'utf8')
);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'API Apoio Autismo - Documentação',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/routines', routineRoutes);
app.use('/sensory-preferences', sensoryPreferenceRoutes);
app.use('/meltdowns', meltdownRoutes);
app.use('/activities', activityRoutes);
app.use('/communication', communicationRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

module.exports = app;
