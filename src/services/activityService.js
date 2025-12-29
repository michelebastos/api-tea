const activityRepository = require('../repositories/activityRepository');
const profileRepository = require('../repositories/profileRepository');

class ActivityService {
  create(activityData) {
    const profile = profileRepository.findById(activityData.profileId);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    return activityRepository.create(activityData);
  }

  getAll(filters) {
    return activityRepository.findAll(filters);
  }

  getById(id) {
    const activity = activityRepository.findById(id);
    if (!activity) {
      throw new Error('Atividade terapêutica não encontrada');
    }
    return activity;
  }

  update(id, activityData) {
    const activity = activityRepository.update(id, activityData);
    if (!activity) {
      throw new Error('Atividade terapêutica não encontrada');
    }
    return activity;
  }

  delete(id) {
    const deleted = activityRepository.delete(id);
    if (!deleted) {
      throw new Error('Atividade terapêutica não encontrada');
    }
    return { message: 'Atividade terapêutica excluída com sucesso' };
  }
}

module.exports = new ActivityService();
