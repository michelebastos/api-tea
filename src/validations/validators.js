const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erro de validação',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validações para autenticação
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  validate
];

// Validações para perfis
const createProfileValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('age').isInt({ min: 0 }).withMessage('Idade deve ser um número inteiro positivo'),
  body('supportLevel').isIn(['leve', 'moderado', 'alto']).withMessage('Nível de suporte deve ser: leve, moderado ou alto'),
  body('diagnosisDate').optional().isISO8601().withMessage('Data de diagnóstico deve ser uma data válida'),
  body('notes').optional().isString(),
  validate
];

const updateProfileValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('age').optional().isInt({ min: 0 }).withMessage('Idade deve ser um número inteiro positivo'),
  body('supportLevel').optional().isIn(['leve', 'moderado', 'alto']).withMessage('Nível de suporte deve ser: leve, moderado ou alto'),
  body('diagnosisDate').optional().isISO8601().withMessage('Data de diagnóstico deve ser uma data válida'),
  validate
];

// Validações para rotinas
const createRoutineValidation = [
  body('profileId').isUUID().withMessage('profileId deve ser um UUID válido'),
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('description').optional().isString(),
  body('time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Horário deve estar no formato HH:mm'),
  body('dayOfWeek').optional().isIn(['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']).withMessage('Dia da semana inválido'),
  validate
];

const updateRoutineValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('title').optional().notEmpty().withMessage('Título não pode estar vazio'),
  body('time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Horário deve estar no formato HH:mm'),
  body('dayOfWeek').optional().isIn(['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']).withMessage('Dia da semana inválido'),
  validate
];

// Validações para preferências sensoriais
const createSensoryPreferenceValidation = [
  body('profileId').isUUID().withMessage('profileId deve ser um UUID válido'),
  body('soundSensitivity').isIn(['baixa', 'média', 'alta']).withMessage('Sensibilidade ao som deve ser: baixa, média ou alta'),
  body('lightSensitivity').isIn(['baixa', 'média', 'alta']).withMessage('Sensibilidade à luz deve ser: baixa, média ou alta'),
  body('touchSensitivity').isIn(['baixa', 'média', 'alta']).withMessage('Sensibilidade ao toque deve ser: baixa, média ou alta'),
  body('foodRestrictions').optional().isArray().withMessage('Restrições alimentares deve ser um array'),
  validate
];

const updateSensoryPreferenceValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('soundSensitivity').optional().isIn(['baixa', 'média', 'alta']).withMessage('Sensibilidade ao som deve ser: baixa, média ou alta'),
  body('lightSensitivity').optional().isIn(['baixa', 'média', 'alta']).withMessage('Sensibilidade à luz deve ser: baixa, média ou alta'),
  body('touchSensitivity').optional().isIn(['baixa', 'média', 'alta']).withMessage('Sensibilidade ao toque deve ser: baixa, média ou alta'),
  body('foodRestrictions').optional().isArray().withMessage('Restrições alimentares deve ser um array'),
  validate
];

// Validações para crises
const createMeltdownValidation = [
  body('profileId').isUUID().withMessage('profileId deve ser um UUID válido'),
  body('trigger').notEmpty().withMessage('Gatilho é obrigatório'),
  body('description').optional().isString(),
  body('intensity').isInt({ min: 1, max: 5 }).withMessage('Intensidade deve estar entre 1 e 5'),
  body('occurredAt').isISO8601().withMessage('occurredAt deve ser uma data válida'),
  validate
];

// Validações para atividades
const createActivityValidation = [
  body('profileId').isUUID().withMessage('profileId deve ser um UUID válido'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('objective').optional().isString(),
  body('durationMinutes').isInt({ min: 1 }).withMessage('Duração deve ser um número inteiro positivo'),
  body('professional').optional().isString(),
  validate
];

const updateActivityValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('durationMinutes').optional().isInt({ min: 1 }).withMessage('Duração deve ser um número inteiro positivo'),
  validate
];

// Validações para comunicação alternativa
const createCommunicationValidation = [
  body('profileId').isUUID().withMessage('profileId deve ser um UUID válido'),
  body('phrase').notEmpty().withMessage('Frase é obrigatória'),
  body('meaning').notEmpty().withMessage('Significado é obrigatório'),
  body('category').isIn(['necessidade', 'emoção', 'dor', 'lazer']).withMessage('Categoria deve ser: necessidade, emoção, dor ou lazer'),
  validate
];

const updateCommunicationValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('phrase').optional().notEmpty().withMessage('Frase não pode estar vazia'),
  body('meaning').optional().notEmpty().withMessage('Significado não pode estar vazio'),
  body('category').optional().isIn(['necessidade', 'emoção', 'dor', 'lazer']).withMessage('Categoria deve ser: necessidade, emoção, dor ou lazer'),
  validate
];

// Validação de ID em parâmetros
const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  validate
];

module.exports = {
  loginValidation,
  createProfileValidation,
  updateProfileValidation,
  createRoutineValidation,
  updateRoutineValidation,
  createSensoryPreferenceValidation,
  updateSensoryPreferenceValidation,
  createMeltdownValidation,
  createActivityValidation,
  updateActivityValidation,
  createCommunicationValidation,
  updateCommunicationValidation,
  idValidation
};
