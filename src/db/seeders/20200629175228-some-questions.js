'use strict';
const {
  questions: questionSeed,
} = require('../../../build/dummyData/questions');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('questions', questionSeed, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('questions', null, {});
  },
};
