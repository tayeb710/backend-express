const { User } = require('./User');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/dbConnector');


const AuthToken = sequelize.define(
  'AuthToken',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        // key: 'id',
        // deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    
  },
  {
    tableName: 'auth_tokens',
    timestamps: false,
  }
);

module.exports = {
  AuthToken,
};
