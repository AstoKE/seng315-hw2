const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  },
  {
    tableName: "users",
    timestamps: true, 
  }
);

module.exports = User;