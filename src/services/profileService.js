const profileRepository = require('../repositories/profileRepository');

class ProfileService {
  create(profileData) {
    return profileRepository.create(profileData);
  }

  getAll() {
    return profileRepository.findAll();
  }

  getById(id) {
    const profile = profileRepository.findById(id);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    return profile;
  }

  update(id, profileData) {
    const profile = profileRepository.update(id, profileData);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    return profile;
  }

  delete(id) {
    const deleted = profileRepository.delete(id);
    if (!deleted) {
      throw new Error('Perfil não encontrado');
    }
    return { message: 'Perfil excluído com sucesso' };
  }
}

module.exports = new ProfileService();
