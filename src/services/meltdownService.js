const meltdownRepository = require('../repositories/meltdownRepository');
const profileRepository = require('../repositories/profileRepository');

class MeltdownService {
  create(meltdownData) {
    const profile = profileRepository.findById(meltdownData.profileId);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    
    if (meltdownData.intensity < 1 || meltdownData.intensity > 5) {
      throw new Error('Intensidade deve estar entre 1 e 5');
    }
    
    return meltdownRepository.create(meltdownData);
  }

  getAll(filters) {
    return meltdownRepository.findAll(filters);
  }

  getById(id) {
    const meltdown = meltdownRepository.findById(id);
    if (!meltdown) {
      throw new Error('Registro de crise não encontrado');
    }
    return meltdown;
  }

  delete(id) {
    const deleted = meltdownRepository.delete(id);
    if (!deleted) {
      throw new Error('Registro de crise não encontrado');
    }
    return { message: 'Registro de crise excluído com sucesso' };
  }
}

module.exports = new MeltdownService();
