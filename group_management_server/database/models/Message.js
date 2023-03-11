const { DataTypes } = require('sequelize');
const getDatabaseInstance = require('../db_connection');
const bcrypt = require("bcryptjs");

const sequelize = getDatabaseInstance('development');
const Message = sequelize.define('messages', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true,
    },
    text: {
        type: DataTypes.STRING,
    },
});

const Like = sequelize.define('likes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true,
    }
});



module.exports = { Message, Like };