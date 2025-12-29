const express = require('express');
const routineController = require('../controllers/routineController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createRoutineValidation, 
  updateRoutineValidation,
  idValidation 
} = require('../validations/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRoutineValidation, routineController.create);
router.get('/', routineController.getAll);
router.get('/:id', idValidation, routineController.getById);
router.put('/:id', updateRoutineValidation, routineController.update);
router.delete('/:id', idValidation, routineController.delete);

module.exports = router;
