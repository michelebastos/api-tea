const express = require('express');
const meltdownController = require('../controllers/meltdownController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createMeltdownValidation,
  idValidation 
} = require('../validations/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createMeltdownValidation, meltdownController.create);
router.get('/', meltdownController.getAll);
router.get('/:id', idValidation, meltdownController.getById);
router.delete('/:id', idValidation, meltdownController.delete);

module.exports = router;
