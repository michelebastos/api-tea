const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class ProfileRepository {
  create(profileData) {
    const profile = {
      id: uuidv4(),
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.profiles.push(profile);
    return profile;
  }

  findAll() {
    return store.profiles;
  }

  findById(id) {
    return store.profiles.find(profile => profile.id === id);
  }

  update(id, profileData) {
    const index = store.profiles.findIndex(profile => profile.id === id);
    if (index === -1) return null;

    store.profiles[index] = {
      ...store.profiles[index],
      ...profileData,
      id,
      updatedAt: new Date().toISOString()
    };
    return store.profiles[index];
  }

  delete(id) {
    const index = store.profiles.findIndex(profile => profile.id === id);
    if (index === -1) return false;

    store.profiles.splice(index, 1);
    return true;
  }
}

module.exports = new ProfileRepository();
