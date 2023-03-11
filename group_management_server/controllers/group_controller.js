const Group = require('../database/models/Group');
const GroupMember = require('../database/models/GroupMember');
const User = require('../database/models/User');
const { Op } = require("sequelize");

const createGroup = async (req, res, next) => {
    const { name, creator } = req.body;
    try {
        let newGroup = await Group.create({
            name: name,
        });

        const user = await User.findByPk(creator);

        const result = await newGroup.addUser(user, { through: GroupMember });
        res.status(200).json({
            status: "success",
            result: newGroup,
        });

    }
    catch (e) {

    }

}


const getUserGroups = async (req, res, next) => {
    const { userId } = req.body;

    const result = await User.findByPk(userId, {
        include: Group
    });
    res.status(200).json({
        status: "success",
        result,
    });
}
const editGroup = (req, res, next) => {

}

const deleteGroup = async (req, res, next) => {
    const { id } = req.params;
    const result = await Group.findByPk(id);
    await result.destroy();
    res.status(200).json({
        status: "success",
        result,
    });

}


const addGroupMember = async (req, res, next) => {
    const { email, groupId } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (user) {


        const existingGroup = await Group.findOne({
            where: {
                id: groupId
            },
            include: [{
                model: User,
                where: {
                    email: email
                }
            }]
        })
        if (existingGroup == null) {
            const group = await Group.findByPk(groupId);

            const result = await group.addUser(user, { through: GroupMember });
            res.status(200).json({
                status: "success",
                result: user,
            });
        }
        else {
            res.status(409).json({

                result: "User Already Exist in this group",
            });
        }
    }
    else {
        res.status(204).json({

            result: "No User Avaiilable",
        });
    }
}

const removeGroupMember = async (req, res, next) => {
    const { user, group } = req.params;

    const existingUser = await User.findByPk(user);
    const existingGroup = await Group.findByPk(group);
    if (existingUser && existingGroup) {

        const updateGroup = await existingGroup.removeUser(existingUser);
        const users = await existingGroup.getUsers();
        res.status(200).json({
            status: "success",
            result: users,
        });
    }
    else {
        res.status(204).json({

            result: "No User Avaiilable",
        });
    }
}



const searchGroupMember = async (req, res, next) => {
    const { text } = req.params;
    const users = await User.findAll({
        where: {
            id: { [Op.not]: req.user.id },
            [Op.or]: [
                { email: { [Op.like]: `%${text}%` } },
                { phone: { [Op.like]: `%${text}%` } }
            ]

        },
        include: [Group]
    });

    res.status(200).json({
        status: "success",
        result: users,
    });
}



module.exports = { createGroup, editGroup, deleteGroup, addGroupMember, searchGroupMember, getUserGroups, removeGroupMember }