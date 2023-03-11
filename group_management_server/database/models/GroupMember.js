const { DataTypes } = require('sequelize');
const getDatabaseInstance = require('../db_connection');

const sequelize = getDatabaseInstance('development');

const User = require("./User");
const Group = require("./Group");
const { Message, Like } = require("./Message");
const GroupMember = sequelize.define(
    "GroupMembers",
    {},
    { timestamps: false }
);

Group.hasMany(Message);
Group.belongsToMany(User, { through: GroupMember });

Message.belongsTo(Group);
Message.belongsTo(User);
Message.hasMany(Like);

User.belongsToMany(Group, { through: GroupMember });
User.hasMany(Message);
User.hasMany(Like);

Like.belongsTo(Message);
Like.belongsTo(User);




module.exports = GroupMember;