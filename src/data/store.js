// Armazenamento em memória para todos os dados
const data = {
  users: [],
  profiles: [],
  routines: [],
  sensoryPreferences: [],
  meltdowns: [],
  activities: [],
  communication: [],
  
  // Função para resetar os dados (útil para testes)
  reset: function() {
    this.users = [];
    this.profiles = [];
    this.routines = [];
    this.sensoryPreferences = [];
    this.meltdowns = [];
    this.activities = [];
    this.communication = [];
  }
};

module.exports = data;
