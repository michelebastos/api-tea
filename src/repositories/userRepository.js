const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

class UserRepository {
  create(userData) {
    const user = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    store.users.push(user);
    return user;
  }

  findByEmail(email) {
    return store.users.find(user => user.email === email);
  }

  findById(id) {
    return store.users.find(user => user.id === id);
  }

  getAll() {
    return store.users;
  }
}

module.exports = new UserRepository();
