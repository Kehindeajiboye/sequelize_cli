'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  otps.init({
    otp_code: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    expired_at: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'otps',
  });
  return otps;
};