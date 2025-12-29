const sensoryPreferenceRepository = require('../repositories/sensoryPreferenceRepository');
const profileRepository = require('../repositories/profileRepository');

class SensoryPreferenceService {
  create(preferenceData) {
    const profile = profileRepository.findById(preferenceData.profileId);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    return sensoryPreferenceRepository.create(preferenceData);
  }

  getAll(filters) {
    return sensoryPreferenceRepository.findAll(filters);
  }

  getById(id) {
    const preference = sensoryPreferenceRepository.findById(id);
    if (!preference) {
      throw new Error('Preferência sensorial não encontrada');
    }
    return preference;
  }

  update(id, preferenceData) {
    const preference = sensoryPreferenceRepository.update(id, preferenceData);
    if (!preference) {
      throw new Error('Preferência sensorial não encontrada');
    }
    return preference;
  }

  delete(id) {
    const deleted = sensoryPreferenceRepository.delete(id);
    if (!deleted) {
      throw new Error('Preferência sensorial não encontrada');
    }
    return { message: 'Preferência sensorial excluída com sucesso' };
  }
}

module.exports = new SensoryPreferenceService();
