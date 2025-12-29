const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class RoutineRepository {
  create(routineData) {
    const routine = {
      id: uuidv4(),
      ...routineData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.routines.push(routine);
    return routine;
  }

  findAll(filters = {}) {
    let routines = store.routines;
    
    if (filters.profileId) {
      routines = routines.filter(r => r.profileId === filters.profileId);
    }
    
    return routines;
  }

  findById(id) {
    return store.routines.find(routine => routine.id === id);
  }

  update(id, routineData) {
    const index = store.routines.findIndex(routine => routine.id === id);
    if (index === -1) return null;

    store.routines[index] = {
      ...store.routines[index],
      ...routineData,
      id,
      updatedAt: new Date().toISOString()
    };
    return store.routines[index];
  }

  delete(id) {
    const index = store.routines.findIndex(routine => routine.id === id);
    if (index === -1) return false;

    store.routines.splice(index, 1);
    return true;
  }
}

module.exports = new RoutineRepository();
