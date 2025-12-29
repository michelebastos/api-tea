const express = require('express');
const communicationController = require('../controllers/communicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createCommunicationValidation, 
  updateCommunicationValidation,
  idValidation 
} = require('../validations/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createCommunicationValidation, communicationController.create);
router.get('/', communicationController.getAll);
router.get('/:id', idValidation, communicationController.getById);
router.put('/:id', updateCommunicationValidation, communicationController.update);
router.delete('/:id', idValidation, communicationController.delete);

module.exports = router;
