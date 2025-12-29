const communicationService = require('../services/communicationService');

class CommunicationController {
  async create(req, res, next) {
    try {
      const communication = communicationService.create(req.body);
      res.status(201).json(communication);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        profileId: req.query.profileId,
        category: req.query.category
      };
      const communications = communicationService.getAll(filters);
      res.status(200).json(communications);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const communication = communicationService.getById(req.params.id);
      res.status(200).json(communication);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const communication = communicationService.update(req.params.id, req.body);
      res.status(200).json(communication);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = communicationService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommunicationController();
