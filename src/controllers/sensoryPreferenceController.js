const sensoryPreferenceService = require('../services/sensoryPreferenceService');

class SensoryPreferenceController {
  async create(req, res, next) {
    try {
      const preference = sensoryPreferenceService.create(req.body);
      res.status(201).json(preference);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        profileId: req.query.profileId
      };
      const preferences = sensoryPreferenceService.getAll(filters);
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const preference = sensoryPreferenceService.getById(req.params.id);
      res.status(200).json(preference);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const preference = sensoryPreferenceService.update(req.params.id, req.body);
      res.status(200).json(preference);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = sensoryPreferenceService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SensoryPreferenceController();
