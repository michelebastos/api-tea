const routineService = require('../services/routineService');

class RoutineController {
  async create(req, res, next) {
    try {
      const routine = routineService.create(req.body);
      res.status(201).json(routine);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        profileId: req.query.profileId
      };
      const routines = routineService.getAll(filters);
      res.status(200).json(routines);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const routine = routineService.getById(req.params.id);
      res.status(200).json(routine);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const routine = routineService.update(req.params.id, req.body);
      res.status(200).json(routine);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = routineService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoutineController();
