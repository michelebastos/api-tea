const express = require('express');
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createActivityValidation, 
  updateActivityValidation,
  idValidation 
} = require('../validations/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createActivityValidation, activityController.create);
router.get('/', activityController.getAll);
router.get('/:id', idValidation, activityController.getById);
router.put('/:id', updateActivityValidation, activityController.update);
router.delete('/:id', idValidation, activityController.delete);

module.exports = router;
