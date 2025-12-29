const activityService = require('../services/activityService');

class ActivityController {
  async create(req, res, next) {
    try {
      const activity = activityService.create(req.body);
      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        profileId: req.query.profileId
      };
      const activities = activityService.getAll(filters);
      res.status(200).json(activities);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const activity = activityService.getById(req.params.id);
      res.status(200).json(activity);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const activity = activityService.update(req.params.id, req.body);
      res.status(200).json(activity);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = activityService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityController();
