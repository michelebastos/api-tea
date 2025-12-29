const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class SensoryPreferenceRepository {
  create(preferenceData) {
    const preference = {
      id: uuidv4(),
      ...preferenceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.sensoryPreferences.push(preference);
    return preference;
  }

  findAll(filters = {}) {
    let preferences = store.sensoryPreferences;
    
    if (filters.profileId) {
      preferences = preferences.filter(p => p.profileId === filters.profileId);
    }
    
    return preferences;
  }

  findById(id) {
    return store.sensoryPreferences.find(pref => pref.id === id);
  }

  update(id, preferenceData) {
    const index = store.sensoryPreferences.findIndex(pref => pref.id === id);
    if (index === -1) return null;

    store.sensoryPreferences[index] = {
      ...store.sensoryPreferences[index],
      ...preferenceData,
      id,
      updatedAt: new Date().toISOString()
    };
    return store.sensoryPreferences[index];
  }

  delete(id) {
    const index = store.sensoryPreferences.findIndex(pref => pref.id === id);
    if (index === -1) return false;

    store.sensoryPreferences.splice(index, 1);
    return true;
  }
}

module.exports = new SensoryPreferenceRepository();
