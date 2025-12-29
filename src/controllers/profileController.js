const profileService = require('../services/profileService');

class ProfileController {
  async create(req, res, next) {
    try {
      const profile = profileService.create(req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const profiles = profileService.getAll();
      res.status(200).json(profiles);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const profile = profileService.getById(req.params.id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const profile = profileService.update(req.params.id, req.body);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = profileService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
