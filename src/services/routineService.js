const routineRepository = require('../repositories/routineRepository');
const profileRepository = require('../repositories/profileRepository');

class RoutineService {
  create(routineData) {
    const profile = profileRepository.findById(routineData.profileId);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    return routineRepository.create(routineData);
  }

  getAll(filters) {
    return routineRepository.findAll(filters);
  }

  getById(id) {
    const routine = routineRepository.findById(id);
    if (!routine) {
      throw new Error('Rotina não encontrada');
    }
    return routine;
  }

  update(id, routineData) {
    const routine = routineRepository.update(id, routineData);
    if (!routine) {
      throw new Error('Rotina não encontrada');
    }
    return routine;
  }

  delete(id) {
    const deleted = routineRepository.delete(id);
    if (!deleted) {
      throw new Error('Rotina não encontrada');
    }
    return { message: 'Rotina excluída com sucesso' };
  }
}

module.exports = new RoutineService();
