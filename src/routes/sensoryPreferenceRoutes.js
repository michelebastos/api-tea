const express = require('express');
const sensoryPreferenceController = require('../controllers/sensoryPreferenceController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createSensoryPreferenceValidation, 
  updateSensoryPreferenceValidation,
  idValidation 
} = require('../validations/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createSensoryPreferenceValidation, sensoryPreferenceController.create);
router.get('/', sensoryPreferenceController.getAll);
router.get('/:id', idValidation, sensoryPreferenceController.getById);
router.put('/:id', updateSensoryPreferenceValidation, sensoryPreferenceController.update);
router.delete('/:id', idValidation, sensoryPreferenceController.delete);

module.exports = router;
