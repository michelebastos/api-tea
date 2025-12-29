const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createProfileValidation, 
  updateProfileValidation,
  idValidation 
} = require('../validations/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createProfileValidation, profileController.create);
router.get('/', profileController.getAll);
router.get('/:id', idValidation, profileController.getById);
router.put('/:id', updateProfileValidation, profileController.update);
router.delete('/:id', idValidation, profileController.delete);

module.exports = router;
