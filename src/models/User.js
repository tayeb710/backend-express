const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/dbConnector');

const User = sequelize.define(
  'User',
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      },
    },
  }
);

User.prototype.validatePassword = function validatePassword(
  password,
  field = 'password'
) {
  return bcrypt.compare(password, this[field]);
};

User.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

module.exports = {
  User,
};
