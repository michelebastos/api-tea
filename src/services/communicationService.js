const communicationRepository = require('../repositories/communicationRepository');
const profileRepository = require('../repositories/profileRepository');

class CommunicationService {
  create(communicationData) {
    const profile = profileRepository.findById(communicationData.profileId);
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }
    return communicationRepository.create(communicationData);
  }

  getAll(filters) {
    return communicationRepository.findAll(filters);
  }

  getById(id) {
    const communication = communicationRepository.findById(id);
    if (!communication) {
      throw new Error('Comunicação alternativa não encontrada');
    }
    return communication;
  }

  update(id, communicationData) {
    const communication = communicationRepository.update(id, communicationData);
    if (!communication) {
      throw new Error('Comunicação alternativa não encontrada');
    }
    return communication;
  }

  delete(id) {
    const deleted = communicationRepository.delete(id);
    if (!deleted) {
      throw new Error('Comunicação alternativa não encontrada');
    }
    return { message: 'Comunicação alternativa excluída com sucesso' };
  }
}

module.exports = new CommunicationService();
