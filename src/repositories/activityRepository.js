const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class ActivityRepository {
  create(activityData) {
    const activity = {
      id: uuidv4(),
      ...activityData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.activities.push(activity);
    return activity;
  }

  findAll(filters = {}) {
    let activities = store.activities;
    
    if (filters.profileId) {
      activities = activities.filter(a => a.profileId === filters.profileId);
    }
    
    return activities;
  }

  findById(id) {
    return store.activities.find(activity => activity.id === id);
  }

  update(id, activityData) {
    const index = store.activities.findIndex(activity => activity.id === id);
    if (index === -1) return null;

    store.activities[index] = {
      ...store.activities[index],
      ...activityData,
      id,
      updatedAt: new Date().toISOString()
    };
    return store.activities[index];
  }

  delete(id) {
    const index = store.activities.findIndex(activity => activity.id === id);
    if (index === -1) return false;

    store.activities.splice(index, 1);
    return true;
  }
}

module.exports = new ActivityRepository();
