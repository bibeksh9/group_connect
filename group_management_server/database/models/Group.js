
const { DataTypes } = require('sequelize');
const getDatabaseInstance = require('../db_connection');

const sequelize = getDatabaseInstance();
const Group = sequelize.define('groups', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,

});

module.exports = Group;