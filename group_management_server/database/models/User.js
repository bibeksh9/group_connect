const { DataTypes } = require('sequelize');
const getDatabaseInstance = require('../db_connection');
const bcrypt = require("bcryptjs");

const sequelize = getDatabaseInstance('development');
const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            let pwd = bcrypt.hashSync(value, 12);
            this.setDataValue('password', pwd);
        }
    },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true, },
    role: {
        type: DataTypes.ENUM,
        values: ['Admin', 'User']
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,

});

User.prototype.correctPassword = function (candidatePassword, userPassword) {
    return bcrypt.compareSync(candidatePassword, userPassword);
};

module.exports = User;