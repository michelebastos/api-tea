const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class MeltdownRepository {
  create(meltdownData) {
    const meltdown = {
      id: uuidv4(),
      ...meltdownData,
      createdAt: new Date().toISOString()
    };
    store.meltdowns.push(meltdown);
    return meltdown;
  }

  findAll(filters = {}) {
    let meltdowns = store.meltdowns;
    
    if (filters.profileId) {
      meltdowns = meltdowns.filter(m => m.profileId === filters.profileId);
    }
    
    if (filters.startDate || filters.endDate) {
      meltdowns = meltdowns.filter(m => {
        const occurredDate = new Date(m.occurredAt);
        if (filters.startDate && occurredDate < new Date(filters.startDate)) return false;
        if (filters.endDate && occurredDate > new Date(filters.endDate)) return false;
        return true;
      });
    }
    
    return meltdowns.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
  }

  findById(id) {
    return store.meltdowns.find(meltdown => meltdown.id === id);
  }

  delete(id) {
    const index = store.meltdowns.findIndex(meltdown => meltdown.id === id);
    if (index === -1) return false;

    store.meltdowns.splice(index, 1);
    return true;
  }
}

module.exports = new MeltdownRepository();
