const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class CommunicationRepository {
  create(communicationData) {
    const communication = {
      id: uuidv4(),
      ...communicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.communication.push(communication);
    return communication;
  }

  findAll(filters = {}) {
    let communications = store.communication;
    
    if (filters.profileId) {
      communications = communications.filter(c => c.profileId === filters.profileId);
    }
    
    if (filters.category) {
      communications = communications.filter(c => c.category === filters.category);
    }
    
    return communications;
  }

  findById(id) {
    return store.communication.find(comm => comm.id === id);
  }

  update(id, communicationData) {
    const index = store.communication.findIndex(comm => comm.id === id);
    if (index === -1) return null;

    store.communication[index] = {
      ...store.communication[index],
      ...communicationData,
      id,
      updatedAt: new Date().toISOString()
    };
    return store.communication[index];
  }

  delete(id) {
    const index = store.communication.findIndex(comm => comm.id === id);
    if (index === -1) return false;

    store.communication.splice(index, 1);
    return true;
  }
}

module.exports = new CommunicationRepository();
