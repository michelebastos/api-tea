const meltdownService = require('../services/meltdownService');

class MeltdownController {
  async create(req, res, next) {
    try {
      const meltdown = meltdownService.create(req.body);
      res.status(201).json(meltdown);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        profileId: req.query.profileId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
      const meltdowns = meltdownService.getAll(filters);
      res.status(200).json(meltdowns);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const meltdown = meltdownService.getById(req.params.id);
      res.status(200).json(meltdown);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = meltdownService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MeltdownController();
