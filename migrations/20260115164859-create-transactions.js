'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      transaction_reference: {
        type: Sequelize.STRING,
        unique: true
      },
      customer_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'customer_id'
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};